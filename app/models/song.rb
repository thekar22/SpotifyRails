class Song < ActiveRecord::Base
	has_many :user_song_taggings, :foreign_key => "song_id", :primary_key => "song_id"

	def self.get(id)
		where("song_id = ?", id)	
	end
end