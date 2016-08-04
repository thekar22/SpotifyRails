class HomeController < ApplicationController
	before_action :set_spotify_user

	# stub method main page after oauth log in
	def index
		
	end

	# return to caller json list of user playlist metadata
	def getPlaylists
		userid = current_user.uid
		playlists = GetPlaylistMetadataFromSpotify.build.call(session["devise.spotify_data"])		
		Playlist.sync_playlists(playlists, userid)		
		render json: playlists
	end

	# return to caller json unique song list from playlists given playlist ids
	def getTagUnion
		playlistids = params[:playlistids]
		songs = []
		userid = current_user.uid		
		playlistids.each do |playlistid|
			result = Playlist.get_playlist_songs(playlistid, userid)
			songs += result
		end		
		songs = songs.compact.uniq { |t| t.id }
		render json: songs
	end

	# return to caller json list of songs shared between given playlist ids
	def getTagIntersection		
		playlistids = params[:playlistids]
		playlists = []
		userid = current_user.uid
		playlistids.each do |playlistid|
			songs = Playlist.get_playlist_songs(playlistid, userid)
			playlists.push(songs)
		end		
		intersection = Playlist.intersect_playlists(playlists)
		render json: intersection
	end

	# return to caller json list of songfeatures for each song id
	def getAudioFeatures
		userid = current_user.uid
		songids = params[:songIds]
		audio_features = GetAudioFeaturesFromSpotify.build.call(songids)						
		render json: audio_features
	end

	# return to caller json list of tracks given search query
	def getQuery
		query = params[:query]
		results = GetQueryFromSpotify.build.call(query)
		render json: results
	end

	# return to caller json of song
	def getSong
		id = params[:songId]
		result = GetSongFromSpotify.build.call(id)
		render json: result
	end

	def addNewTagForSong
		tagname = params[:tagName]
		songid = params[:songId]
		userid = current_user.uid
		#TODO
		

		result = true
		
		render json: result
	end

	def addExistingTagForSong
		tagid = params[:tagId]
		songid = params[:songId]
		userid = current_user.uid
		#TODO
		

		result = true
		
		render json: result
	end

	def removeTagForSong
		tagid = params[:tagId]
		songid = params[:songId]
		userid = current_user.uid

		UserSongTagging.remove_tag_to_song(userid, tagid, songid)
		true
	end

	# return to caller json all tags to which song belongs
	def getCurrentTagsForSong
		songid = params[:songId]
		userid = current_user.uid
		tags = UserSongTagging.get_tags_for_song(userid, songid)
		playlists = tags.map { |tag| tag.playlist}

		render json: playlists
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