class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :song_id
      t.string :name
      t.string :album_id
      t.integer :duration_ms
      t.string :artist

      t.timestamps null: false
    end
  end
end
