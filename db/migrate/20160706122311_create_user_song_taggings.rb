class CreateUserSongTaggings < ActiveRecord::Migration
  def change
    create_table :user_song_taggings do |t|
    	t.string :song_id
    	t.string :playlist_id
    	t.string :user_id
		t.timestamps null: false
    end
  end
end