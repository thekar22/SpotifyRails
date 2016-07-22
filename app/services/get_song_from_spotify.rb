class GetSongFromSpotify  
	def self.build
		new
	end

	def call(id)
		RSpotify::Track.find(id)
	end
end
