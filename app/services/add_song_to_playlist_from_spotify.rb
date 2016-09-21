class AddSongToPlaylistFromSpotify  
	def self.build
		new
	end

	def call(song, playlist)
		playlist.add_tracks!([song])
	end
end