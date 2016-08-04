class GetPlaylistFromSpotifyById
	def self.build
		new
	end

	def call(playlistid, userid)		
		RSpotify::Playlist.find(userid, playlistid)
	end
end