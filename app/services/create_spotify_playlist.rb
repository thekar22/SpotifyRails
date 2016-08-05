class CreateSpotifyPlaylist
	def self.build
		new
	end

	def call(user, tagname)
		user.create_playlist!(tagname)
	end
end