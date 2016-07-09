class UserSongTagging < ActiveRecord::Base
	# Note: tag id corresponds to spotify playlist id

	belongs_to :song, :foreign_key => "song_id", :primary_key => "song_id"
	belongs_to :playlist, :foreign_key => "playlist_id", :primary_key => "playlist_id"
	belongs_to :user, :foreign_key => "user_id", :primary_key => "uid"

	validates :playlist_id, uniqueness: { scope: [:user_id, :song_id] }

	arguments_error = "no arguments can be empty"

  	def self.get_tags_for_song(userid, songid)
  		if songid.present? && userid.present? 
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

  	def self.add_tag_to_song(userid, tagid, songid)
  		if songid.present? && userid.present? && tagid.present?
  			create(user_id: userid, song_id: songid, playlist_id: tagid)
  		else
  			raise arguments_error
		end
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

  	def self.remove_unused_tags(playlist_ids_for_removal, userid)
		playlist_ids_for_removal.each do |id|			
			UserSongTagging.remove_tag(userid, id)
		end
	end

  	def self.get_current_user_tags(userid)		
  		if userid.present?
			where("user_id = ?", userid).select(:playlist_id).distinct		
  		else
  			raise arguments_error
		end
  	end

  	def self.update_tags(userid, tagid, new_songid_list)  		
  		if tagid.present? && userid.present? 
	  		get_songs_for_tag(userid, tagid).destroy_all

	  		new_songid_list.each do |songid|
	  			add_tag_to_song(userid, tagid, songid)
	  		end
	  	else
	  		raise arguments_error
	  	end
  	end
end
