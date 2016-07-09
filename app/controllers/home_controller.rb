class HomeController < ApplicationController
	before_action :set_spotify_user
	helper_method :getPlaylistSongsFromSpotify, :intersectPlaylists, :getPlaylistMetadataFromSpotify, :getSongFromSpotify, 
					:filterPlaylistOwnership, :syncCachedPlaylists

	# stub method main page after oauth log in
	def index
		
	end

	# return to caller json list of user playlist metadata
	def getPlaylists
		userid = current_user.uid
		playlists = getPlaylistMetadataFromSpotify()
		syncCachedPlaylists(playlists, userid)
		render json: playlists
	end

	def syncCachedPlaylists(playlists, userid)
		userid = current_user.uid
		current_playlists = playlists
		cache_playlists = UserSongTagging.get_current_user_tags(userid)

		current_playlist_ids = []
		cache_playlist_ids = []

		current_playlists.each do |playlist|
			current_playlist_ids.push(playlist.id)
			cache_result = Playlist.get(playlist.id)
			if cache_result.length == 0				
				# add playlist info			
				Playlist.create(playlist_id: playlist.id, name: playlist.name, 
					owner_id: playlist.owner.id, snapshot_id: playlist.snapshot_id,
					total: playlist.total, collaborative: playlist.collaborative,
					followers:playlist.followers, public: playlist.public, stale: true)
			else
				# check staleness
				if !cache_result[0].snapshot_id.eql? playlist.snapshot_id					
					cache_result[0].stale = true
					cache_result[0].save
				end
			end
		end
		
		cache_playlists.each do |playlist|
			cache_playlist_ids.push(playlist.playlist_id)
		end
		UserSongTagging.remove_unused_tags(cache_playlist_ids - current_playlist_ids, userid)
	end

	# return to caller json unique song list given single playlist id
	def getPlaylistSongs(playlistid, userid)
		songs = []
		userid = current_user.uid
		# check cache
		cache_result = Playlist.get(playlistid)		

		if cache_result.length == 0
			# TODO this should not happen in normal workflow, but in this scenario, get playlist 			
		else
			if cache_result[0].stale == true
				syncCachedTaggedTracks(playlistid, userid)
				cache_result[0].stale = false
				cache_result[0].save				
			end 
		end
		song_tags = UserSongTagging.get_songs_for_tag(userid, playlistid)
		song_tags.each do |song_tag|
			songs.push(song_tag.song)
		end		
		songs
	end

	# remove tag, get songs from spotify, create taggings, store songs, set stale to false 
	def syncCachedTaggedTracks(playlistid, userid)
		UserSongTagging.remove_tag(userid, playlistid)
		spotify_tracks = getPlaylistSongsFromSpotify(userid, playlistid)
		spotify_tracks = spotify_tracks.uniq { |t| t.id }
		
		spotify_tracks.each do |track|
			# TODO ensure that duplicates are not created
			Song.create(song_id: track.id, name: track.name, album_id: track.album.id, 
				duration_ms: track.duration_ms, artist: track.artists[0].name)
			UserSongTagging.create(song_id: track.id, playlist_id: playlistid, user_id: userid)
		end
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
		userid = current_user.uid		
		playlistids.each do |playlistid|
			result = getPlaylistSongs(playlistid, userid)
			tracks += result
		end
		tracks = tracks.uniq { |t| t.id }
		render json: tracks
	end

	# return to caller json list of songs shared between given playlist ids
	def getPlaylistIntersection		
		playlistids = params[:playlistids]
		playlists = []
		userid = current_user.uid
		playlistids.each do |playlistid|
			tracks = getPlaylistSongs(playlistid, userid)
			playlists.push(tracks)
		end
		intersection = intersectPlaylists(playlists)
		render json: intersection
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
		userid = current_user.uid
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
		userid = current_user.uid
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