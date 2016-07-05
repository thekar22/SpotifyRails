class CreatePlaylists < ActiveRecord::Migration
  def change
    create_table :playlists do |t|
      t.string :playlist_id
      t.string :name
      t.string :owner_id
      t.string :snapshot_id
      t.integer :total
      t.boolean :collaborative
      t.integer :followers
      t.boolean :public

      t.timestamps null: false
    end
  end
end
