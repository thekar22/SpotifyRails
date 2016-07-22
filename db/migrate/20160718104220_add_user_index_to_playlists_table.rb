class AddUserIndexToPlaylistsTable < ActiveRecord::Migration
  def change
  	add_index :playlists, :owner_id
  end
end
