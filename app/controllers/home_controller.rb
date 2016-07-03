class HomeController < ApplicationController
	before_action :set_spotify_user
	helper_method :getPlaylistSongsFromSpotify, :intersectPlaylists, :getPlaylistMetadataFromSpotify, :getSongFromSpotify, :filterPlaylistOwnership

	# stub method main page after oauth log in
	def index
		
	end

	# return to caller json list of user playlist metadata
	def getPlaylists
		playlists = getPlaylistMetadataFromSpotify()
		render json: playlists
	end

	# helper method to return all user's playlist metadata
	def getPlaylistMetadataFromSpotify
		limit = 50 # Spotify API limit of 50 playlists at a time
		user = session["devise.spotify_data"]	
		offset = 0		

		list_batch = user.playlists(limit: limit, offset: offset)
		playlists = list_batch.count > 0 ? list_batch : []
		offset += limit

		while list_batch.count > 0
			list_batch = user.playlists(limit: limit, offset: offset)				
			if list_batch.count > 0
				playlists += list_batch
				offset += limit
			end
		end
		filterPlaylistOwnership(playlists, user.id)
	end

	def filterPlaylistOwnership(playlists, ownerid)
		playlists.select { |list|
			list.owner.id.eql? ownerid
		}
	end

	# return to caller json unique song list from playlists given playlist ids
	def getPlaylistUnion
		playlistids = params[:playlistids]
		tracks = []
		userid = session["devise.spotify_data"].id
		playlistids.each do |playlistid|
			tracks += getPlaylistSongsFromSpotify(userid, playlistid)
		end
		tracks = tracks.uniq { |t| t.id }
		render json: tracks
	end

	# return to caller json list of songs shared between given playlist ids
	def getPlaylistIntersection
		playlistids = params[:playlistids]
		playlists = []

		userid = session["devise.spotify_data"].id
		playlistids.each do |playlistid|
			tracks = getPlaylistSongs(userid, playlistid).uniq { |p| p.id }
			playlists.push(tracks)
		end
		intersection = intersectPlaylists(playlists)
		render json: intersection
	end

	# return to caller json unique song list given single playlist id
	def getPlaylistSongs
		playlistid = params[:playlistid]
		userid = session["devise.spotify_data"].id
		tracks = getPlaylistSongsFromSpotify(userid, playlistid)
		tracks = tracks.uniq { |t| t.id }
		render json: tracks
	end

	# helper method to retrieve songs given a playlist id
	def getPlaylistSongsFromSpotify(userid, playlistid)
		count = 0
		begin
			return RSpotify::Playlist.find(userid, playlistid).tracks
		rescue # handle intermittent spotify api call errors 
			if (count < 3)
				count += 1
				retry
			else
				raise
			end
		end
	end

	# helper method to return intersection of songs for given playlists
	def intersectPlaylists(playlists)
		song_hash = {}

		playlists.each  { |list|
		  list.each { |song|
		  	if song_hash.key?(song.id)
		  		song_hash[song.id][:count] += 1
		  	else
		  		song_hash[song.id] = {obj: song, count: 1}
		  	end
		  }
		}

		intersection = []
		full_count = playlists.length
		song_hash.each { |key, value|
			if ( value[:count] == full_count )
				intersection.push(value[:obj])
			end
		}
		intersection
	end

	# return to caller json list of songfeatures for each song id
	def getAudioFeatures
		userid = session["devise.spotify_data"].id
		songids = params[:songIds]
		audio_features = RSpotify::AudioFeatures.find(songids)						
		render json: audio_features
	end

	# return to caller json list of tracks given search query
	def getQuery
		query = params[:query]
		results = getQueryFromSpotify(query)
		render json: results
	end

	# return to caller json of song
	def getSong
		id = params[:songId]
		result = getSongFromSpotify(id)
		render json: result
	end

	# helper method to retrieve Spotify tracks given search query
	def getQueryFromSpotify(query)		
		tracks = RSpotify::Track.search(query)
	end

	# helper method to get track for given id
	def getSongFromSpotify(id)
		RSpotify::Track.find(id)
	end

	# return to caller json all tags to which song belongs
	def getCurrentTagsForSong
		tags = []
		targetid = params[:songId]
		#TODO
		##short option
		#get all tags that have given songid

		##very long option, should only ever do once
		playlists = getPlaylistMetadataFromSpotify()
		userid = session["devise.spotify_data"].id
		playlists.each { |list|
			songs = getPlaylistSongsFromSpotify(userid, list.id)
			songs.each { |song|
				if targetid == song.id
					tags.push(list)
					break
				end
			}
		}
		render json: tags
	end

	# spotify user created from oauth will be saved in current devise session; will be removed when devise next clears session
	def set_spotify_user
		if session["spotify_data"]
			session["devise.spotify_data"] = RSpotify::User.new(session["spotify_data"])
			session["spotify_data"] = nil
		elsif session["devise.spotify_data"]
			session["devise.spotify_data"] = RSpotify::User.new(session["devise.spotify_data"])
		end

		 if !session["devise.spotify_data"]
		 	if !action_name.eql? "index"
		 		# redirect to index if oauth not set properly
		 		redirect_to action: "index"
		 	end
		 end
	end
end