class AddSongsToPlaylistFromSpotify  
	def self.build
		new
	end

	def call(songs, playlist)
		playlist.add_tracks!(songs)
	end
end