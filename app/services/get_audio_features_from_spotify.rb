class GetAudioFeaturesFromSpotify  
	def self.build
		new
	end

	def call(ids)
		RSpotify::AudioFeatures.find(ids)	
	end
end
