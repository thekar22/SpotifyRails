class RemoveSongFromPlaylistFromSpotify
	def self.build
		new
	end

	def call(song, playlist)				
		playlist.remove_tracks!([song])
	end
end