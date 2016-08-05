class Playlist < ActiveRecord::Base
	has_many :user_song_taggings, :foreign_key => "playlist_id", :primary_key => "playlist_id"
	validates_uniqueness_of :playlist_id

	arguments_error = "no arguments can be empty"

	def self.get(id)
		where("playlist_id = ?", id).first
	end

	def self.create_new_playlists(spotify_playlists)		
		playlist_rows = []
		spotify_playlists.each do |spotify_playlist|
			playlist_rows.push "('#{spotify_playlist.id}', '#{spotify_playlist.name.gsub("'", "''")}', '#{spotify_playlist.owner.id}', '#{spotify_playlist.snapshot_id}', '#{spotify_playlist.total}', '#{spotify_playlist.collaborative}', '#{spotify_playlist.public}', true, '#{Time.now}', '#{Time.now}')"
		end
		sql = "INSERT INTO playlists (playlist_id, name, owner_id, snapshot_id, total, collaborative, public, stale, created_at, updated_at) VALUES #{playlist_rows.join(", ")}"
		ActiveRecord::Base.connection.execute(sql)
	end

	def self.update_existing_playlists(spotify_playlists, matched_db_playlists_dictionary)
		spotify_playlists.each do |spotify_playlist|
			if matched_db_playlists_dictionary.has_key? spotify_playlist.id
				db_playlist = matched_db_playlists_dictionary[spotify_playlist.id]
				if !db_playlist.snapshot_id.eql? spotify_playlist.snapshot_id
					db_playlist.stale = true
					db_playlist.snapshot_id = spotify_playlist.snapshot_id
					db_playlist.save
				end
			end
		end
	end

	def self.sync_playlists(spotify_playlists, userid)
		db_playlists_ids = Playlist.get_playlists_for_user(userid).map {|playlist| playlist.playlist_id}
		spotify_playlist_ids = spotify_playlists.map {|playlist| playlist.id}

		matched_db_playlists = Playlist.where(playlist_id: spotify_playlist_ids)
		matched_db_playlists_dictionary = {}

		matched_db_playlists.each do |playlist|
			matched_db_playlists_dictionary[playlist.playlist_id] = playlist
		end

		playlists_for_update = []
		playlists_for_creation = []
		
		spotify_playlists.each do |spotify_playlist|
			if matched_db_playlists_dictionary.has_key? spotify_playlist.id
				playlists_for_update.push(spotify_playlist)
			else
				playlists_for_creation.push(spotify_playlist)
			end
		end		

		if playlists_for_update.length > 0 
			Playlist.update_existing_playlists(playlists_for_update, matched_db_playlists_dictionary)
		end
		if playlists_for_creation.length > 0 
			Playlist.create_new_playlists(playlists_for_creation)
		end
		UserSongTagging.remove_tags(db_playlists_ids - spotify_playlist_ids, userid)
	end

	def self.get_playlists_for_user(ownerid)
		if ownerid.present?
			where(owner_id: ownerid)
		else
			raise arguments_error
		end
	end

	# return to caller json unique song list given single playlist id
	def self.get_playlist_songs(playlistid, userid)
		songs = []
		# check cache
		result = Playlist.get(playlistid)		

		if !result
			# TODO this should not happen in normal workflow, but in this scenario, get playlist 			
		else
			if result.stale == true
				UserSongTagging.sync_tag_with_playlist(playlistid, userid)
				result.stale = false
				result.save
			end
		end
		song_tags = UserSongTagging.get_songs_for_tag(userid, playlistid)
		song_tags.each do |song_tag|
			songs.push(song_tag.song)
		end		
		songs.compact
	end

	# helper method to return intersection of songs for given playlists
	def self.intersect_playlists(playlists)
		song_hash = {}
		playlists.each  { |list|
		  list.each { |song|
		  	if song_hash.key?(song.song_id)
		  		song_hash[song.song_id][:count] += 1
		  	else
		  		song_hash[song.song_id] = {obj: song, count: 1}
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