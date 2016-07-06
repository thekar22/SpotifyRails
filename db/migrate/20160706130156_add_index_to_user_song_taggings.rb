class AddIndexToUserSongTaggings < ActiveRecord::Migration
  def change
  	add_index :user_song_taggings, :user_id
  	add_index :user_song_taggings, :playlist_id
  	add_index :user_song_taggings, :song_id
  end
end
