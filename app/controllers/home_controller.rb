class HomeController < ApplicationController
	before_action :set_spotify_user

	#main page after oauth log in
	def index
		
	end

	#return playlists in json
	def getPlaylists
		if session["devise.spotify_data"]
			if session["devise.spotify_data"].playlists
				@playlists = session["devise.spotify_data"].playlists
				render json: @playlists
			end
		end
	end

	def getAllSongsFromPlaylists
		@tracks = []
		if session["devise.spotify_data"]
			userid = session["devise.spotify_data"].id
			pids = params[:pids]
			pids.each do |playlistid|
				@tracks += RSpotify::Playlist.find(userid, playlistid).tracks
			end
			@tracks = @tracks.uniq
			render json: @tracks
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