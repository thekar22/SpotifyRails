class AddIndexToSongsTable < ActiveRecord::Migration
  def change
  	add_index :songs, :song_id
  end
end
