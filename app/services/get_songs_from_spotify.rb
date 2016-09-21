class GetSongsFromSpotify  
	def self.build
		new
	end

	def call(ids)
		RSpotify::Track.find(ids)
	end
end