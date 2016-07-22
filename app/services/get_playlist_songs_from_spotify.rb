class GetPlaylistSongsFromSpotify  
	def self.build
		new
	end

	def call(userid, playlistid)
		count = 0
		begin			
			return RSpotify::Playlist.find(userid, playlistid).tracks
		rescue # handle intermittent spotify api call errors 
			if (count < 3)
				count += 1
				retry
			else
				raise
			end
		end
	end
end
