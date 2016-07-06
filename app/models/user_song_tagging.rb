class UserSongTagging < ActiveRecord::Base
	# Note: tag id corresponds to spotify playlist id
	validates :playlist_id, uniqueness: { scope: [:user_id, :song_id] }

  	def self.get_tags_for_song(userid, songid)
  		if songid.present? && userid.present? 
  			where("user_id = ? and song_id = ?", userid, songid)
  		else
  			raise "no arguments can be empty"
		end
  	end

  	def self.get_songs_for_tag(userid, tagid)
  		if tagid.present? && userid.present? 
  			where("user_id = ? and playlist_id = ?", userid, tagid)
  		else
  			raise "no arguments can be empty"
		end  		
  	end

  	def self.add_tag_to_song(userid, tagid, songid)
  		if songid.present? && userid.present? && tagid.present?
  			create(user_id: userid, song_id: songid, playlist_id: tagid)
  		else
  			raise "no arguments can be empty"
		end
  	end

  	def self.remove_tag_from_song(userid, tagid, songid)
  		if songid.present? && userid.present? && tagid.present?
  			where("user_id = ? and song_id = ? and playlist_id = ?", userid, songid, tagid).destroy_all  			
  		else
  			raise "no arguments can be empty"
		end
  	end

  	def self.get_current_user_tags(userid)		
  		if userid.present?
			where("user_id = ?", userid).select(:playlist_id).distinct
  		end
  		else
  			raise "no arguments can be empty"
		end
  	end

  	def self.update_tags(userid, tagid, new_songid_list)  		
  		if tagid.present? && userid.present? 
	  		get_songs_for_tag(userid, tagid).destroy_all

	  		new_songid_list.each do |songid|
	  			add_tag_to_song(userid, tagid, songid)
	  		end
	  	else
	  		raise "userid and tagid cannot be empty"
	  	end
  	end
end
