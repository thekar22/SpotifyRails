class AddStaleToPlaylists < ActiveRecord::Migration
  def change
  	add_column :playlists, :stale, :boolean
  end
end
