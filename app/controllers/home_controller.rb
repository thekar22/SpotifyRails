class HomeController < ApplicationController
	before_action :set_spotify_user
	helper_method :getPlaylistSongs

	#main page after oauth log in
	def index
		
	end

	#return user playlist metadata
	def getPlaylistMetadata
		limit = 50 # Spotify API limit of 50 playlists at a time
		if session["devise.spotify_data"]
			user = session["devise.spotify_data"]	
			offset = 0		

			list_batch = user.playlists(limit: limit, offset: offset)
			@playlists = list_batch.count > 0 ? list_batch : []
			offset += limit

			while list_batch.count > 0
				list_batch = user.playlists(limit: limit, offset: offset)				
				if list_batch.count > 0
					@playlists += list_batch
					offset += limit
				end
			end
			render json: @playlists
		end
	end

	#return all unique songs from playlists given playlist ids
	def getPlaylistUnion
		playlistids = params[:playlistids]
		@tracks = []
		if session["devise.spotify_data"]
			userid = session["devise.spotify_data"].id
			playlistids.each do |playlistid|
				@tracks += getPlaylistSongs(userid, playlistid)
			end
			@tracks = @tracks.uniq
			render json: @tracks
		end
	end

	#return unique songs from single playlist
	def getPlaylistSongs
		playlistid = params[:playlistid]
		if session["devise.spotify_data"]
			userid = session["devise.spotify_data"].id
			@tracks = getPlaylistSongs(userid, playlistid)
			@tracks = @tracks.uniq
			render json: @tracks
		end
	end

	#helper method to retrieve songs given a playlist id
	def getPlaylistSongs(userid, playlistid)
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

	#return list of songfeatures for each song id
	def getAudioFeatures
		if session["devise.spotify_data"]
			userid = session["devise.spotify_data"].id
			songids = params[:songids]
			@audio_features = RSpotify::AudioFeatures.find(songids)						
			render json: @audio_features
		end
	end

	# spotify user created from oauth will be saved in current devise session; will be removed when devise next clears session
	def set_spotify_user
		if session["spotify_data"]
			session["devise.spotify_data"] = RSpotify::User.new(session["spotify_data"])
			session["spotify_data"] = nil

		elsif session["devise.spotify_data"]
			session["devise.spotify_data"] = RSpotify::User.new(session["devise.spotify_data"])
		end
	end
end