class AddIndexToPlaylistsTable < ActiveRecord::Migration
  def change
  	add_index :playlists, :playlist_id
  end
end
