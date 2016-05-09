class HomeController < ApplicationController
	def index
		if session["spotify_data"]
			session["devise.spotify_data"] = RSpotify::User.new(session["spotify_data"])
			session["spotify_data"] = nil

		elsif session["devise.spotify_data"]
			session["devise.spotify_data"] = RSpotify::User.new(session["devise.spotify_data"])
		end

		if session["devise.spotify_data"]
			@playlists = session["devise.spotify_data"].playlists
		end
	end
end