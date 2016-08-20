class GetPlaylistSongsFromSpotify  
	def self.build
		new
	end

	def call(userid, playlistid)
		count = 0
		begin
			limit = 100 # Spotify API limit of 100 songs at a time			
			offset = 0		
			song_batch = RSpotify::Playlist.find(userid, playlistid).tracks(limit: limit, offset: offset)
			songs = song_batch.count > 0 ? song_batch : []
			offset += limit

			while song_batch.count > 0
				song_batch = RSpotify::Playlist.find(userid, playlistid).tracks(limit: limit, offset: offset)
				if song_batch.count > 0
					songs += song_batch
					offset += limit
				end
			end
			return songs
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