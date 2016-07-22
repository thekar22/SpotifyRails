class GetPlaylistMetadataFromSpotify  
	def self.build
		new
	end

	def call(user)
		limit = 50 # Spotify API limit of 50 playlists at a time			
		offset = 0		
		list_batch = user.playlists(limit: limit, offset: offset)
		playlists = list_batch.count > 0 ? list_batch : []
		offset += limit

		while list_batch.count > 0
			list_batch = user.playlists(limit: limit, offset: offset)
			if list_batch.count > 0
				playlists += list_batch
				offset += limit
			end
		end
		filterPlaylistOwnership(playlists, user.id)
	end

	def filterPlaylistOwnership(playlists, ownerid)
		playlists.select { |list|
			list.owner.id.eql? ownerid
		}
	end
end
