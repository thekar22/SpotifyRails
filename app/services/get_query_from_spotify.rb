class GetQueryFromSpotify  
	def self.build
		new
	end

	def call(query)
		tracks = RSpotify::Track.search(query)
	end
end
