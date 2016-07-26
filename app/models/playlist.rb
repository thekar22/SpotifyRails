class Playlist < ActiveRecord::Base
	has_many :user_song_taggings, :foreign_key => "playlist_id", :primary_key => "playlist_id"
	validates_uniqueness_of :playlist_id

	arguments_error = "no arguments can be empty"

	def self.get(id)
		where("playlist_id = ?", id)	
	end

	def self.sync_playlists(playlists, userid)		
		current_playlists = playlists
		cache_playlists = Playlist.get_playlists_for_user(userid)

		current_playlist_ids = []
		cache_playlist_ids = []

		current_playlists.each do |playlist|
			current_playlist_ids.push(playlist.id)
			cache_result = Playlist.get(playlist.id)
			if cache_result.length == 0				
				# add playlist info			
				Playlist.create(playlist_id: playlist.id, name: playlist.name, 
					owner_id: playlist.owner.id, snapshot_id: playlist.snapshot_id,
					total: playlist.total, collaborative: playlist.collaborative,
					followers:playlist.followers, public: playlist.public, stale: true)
			else
				# check staleness
				if !cache_result[0].snapshot_id.eql? playlist.snapshot_id					
					cache_result[0].stale = true
					cache_result[0].save
				end
			end
		end
		
		cache_playlists.each do |playlist|
			cache_playlist_ids.push(playlist.playlist_id)
		end
		UserSongTagging.remove_tags(cache_playlist_ids - current_playlist_ids, userid)
	end

	def self.get_playlists_for_user(ownerid)
		if ownerid.present?
			where("owner_id = ?", ownerid)
		else
			raise arguments_error
		end
	end

		# return to caller json unique song list given single playlist id
	def self.get_playlist_songs(playlistid, userid)
		songs = []
		# check cache
		cache_result = Playlist.get(playlistid)		

		if cache_result.length == 0
			# TODO this should not happen in normal workflow, but in this scenario, get playlist 			
		else
			if cache_result[0].stale == true
				UserSongTagging.sync_tag_with_playlist(playlistid, userid)
				cache_result[0].stale = false
				cache_result[0].save
			end 
		end
		song_tags = UserSongTagging.get_songs_for_tag(userid, playlistid)
		song_tags.each do |song_tag|
			songs.push(song_tag.song)
		end		
		songs
	end

	# helper method to return intersection of songs for given playlists
	def self.intersect_playlists(playlists)
		song_hash = {}
		playlists.each  { |list|
		  list.each { |song|
		  	if song_hash.key?(song.id)
		  		song_hash[song.id][:count] += 1
		  	else
		  		song_hash[song.id] = {obj: song, count: 1}
		  	end
		  }
		}

		intersection = []
		full_count = playlists.length
		song_hash.each { |key, value|
			if ( value[:count] == full_count )
				intersection.push(value[:obj])
			end
		}
		intersection
	end
end