class UserSongTagging < ActiveRecord::Base
	# Note: tag id corresponds to spotify playlist id

	belongs_to :song, :foreign_key => "song_id", :primary_key => "song_id"
	belongs_to :playlist, :foreign_key => "playlist_id", :primary_key => "playlist_id"
	belongs_to :user, :foreign_key => "user_id", :primary_key => "uid"

	validates :playlist_id, uniqueness: { scope: [:user_id, :song_id] }

	arguments_error = "no arguments can be empty"

	def self.get_tags_for_song(userid, songid)
		if songid.present? && userid.present?
			UserSongTagging.sync_all_tags(userid)			
			where("user_id = ? and song_id = ?", userid, songid)
		else
			raise arguments_error
		end
	end

	def self.get_songs_for_tag(userid, tagid)
		if tagid.present? && userid.present? 
			where("user_id = ? and playlist_id = ?", userid, tagid)
		else
			raise arguments_error
		end
	end

	def self.add_tag_to_song(userid, spotify_playlist, songid)
		spotify_track = GetSongFromSpotify.build.call(songid)
		Song.create(song_id: spotify_track.id, name: spotify_track.name, album_id: spotify_track.album.id, 
			duration_ms: spotify_track.duration_ms, artist: spotify_track.artists[0].name)

		if songid.present? && userid.present? && spotify_playlist.id.present?			
			create(user_id: userid, song_id: songid, playlist_id: spotify_playlist.id)			
			AddSongToPlaylistFromSpotify.build.call(spotify_track, spotify_playlist)
			return spotify_playlist
		else
			raise arguments_error
		end
	end

	def self.add_tag_to_songs(userid, spotify_playlist, songids)
		# TODO null check on songids array
		spotify_tracks = GetSongsFromSpotify.build.call(songids)
		spotify_tracks.each do |track|
			Song.create(song_id: track.id, name: track.name, album_id: track.album.id, 
			duration_ms: track.duration_ms, artist: track.artists[0].name)
			create(user_id: userid, song_id: track.id, playlist_id: spotify_playlist.id)			
		end
			AddSongsToPlaylistFromSpotify.build.call(spotify_tracks, spotify_playlist)
			return spotify_playlist
	end

	def self.remove_tag_from_song(userid, tagid, songid)
		if songid.present? && userid.present? && tagid.present?
			where("user_id = ? and song_id = ? and playlist_id = ?", userid, songid, tagid).destroy_all  			
		else
			raise arguments_error
		end
	end

	def self.remove_tag(userid, tagid)
		if userid.present? && tagid.present?
			where("user_id = ? and playlist_id = ?", userid, tagid).destroy_all  			
		else
			raise arguments_error
		end
	end

	def self.remove_tags(playlist_ids_for_removal, userid)
		playlist_ids_for_removal.each do |id|
			UserSongTagging.remove_tag(userid, id)
		end
	end

	def self.get_user_tags(userid)
		if userid.present?
			where("user_id = ?", userid).select(:playlist_id).distinct
		else
			raise arguments_error
		end
	end

	def self.sync_all_tags(userid)
		
		all_user_tracks = []
		song_dictionary = {}
		song_rows = []
		tag_rows = Array.new

		user_playlists = Playlist.get_playlists_for_user(userid)
		stale_playlists_ids = []
		user_playlists.each do |playlist|
			if playlist.stale == true

				stale_playlists_ids.push playlist.playlist_id
				spotify_tracks = GetPlaylistSongsFromSpotify.build.call(userid, playlist.playlist_id).uniq { |t| t.id }
				
				spotify_tracks.each do |track|
					if !song_dictionary.has_key? track.id
						song_dictionary[track.id] = track
						all_user_tracks << track
					end

					tag_rows << "('#{track.id}', '#{playlist.playlist_id}', '#{userid}', '#{Time.now}', '#{Time.now}')"
				end
			end
		end

		user_track_ids = all_user_tracks.map { |track| track.id }
		all_track_ids = Song.pluck(:song_id)

		song_ids_for_creation = user_track_ids - all_track_ids

		song_ids_for_creation.each do |id|
			track = song_dictionary[id]
			song_rows << "('#{track.id}', '#{track.name.gsub("'", "''")}', '#{track.duration_ms}', '#{track.artists[0].name.gsub("'", "''")}', '#{Time.now}', '#{Time.now}')"
		end
		
		UserSongTagging.where(playlist_id: stale_playlists_ids).destroy_all

		if song_rows.length > 0
			song_sql = "INSERT INTO songs (song_id, name, duration_ms, artist, created_at, updated_at) VALUES #{song_rows.join(", ")}"
			ActiveRecord::Base.connection.execute(song_sql)
		end
		if tag_rows.length > 0
			tag_sql = "INSERT INTO user_song_taggings (song_id, playlist_id, user_id, created_at, updated_at) VALUES #{tag_rows.join(", ")}"	
			ActiveRecord::Base.connection.execute(tag_sql)
		end

		user_playlists.update_all stale: false
	end

  	# remove tag, get songs from spotify, create taggings, store songs, set stale to false
	def self.sync_tag_with_playlist(playlistid, userid)		
		UserSongTagging.remove_tag(userid, playlistid)
		spotify_tracks = GetPlaylistSongsFromSpotify.build.call(userid, playlistid)
		spotify_tracks = spotify_tracks.uniq { |t| t.id }
		
		spotify_tracks.each do |track|
			Song.create(song_id: track.id, name: track.name, album_id: track.album.id,
				duration_ms: track.duration_ms, artist: track.artists[0].name)
			UserSongTagging.create(song_id: track.id, playlist_id: playlistid, user_id: userid)
		end
	end

	private

		def self.destroy_all
			Playlist.all.destroy_all
			Song.all.destroy_all
			UserSongTagging.all.destroy_all
		end

end
