class Playlist < ActiveRecord::Base
	def self.get(id)
		where("playlist_id = ?", id)	
  	end
end