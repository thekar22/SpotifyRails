class AddTokenToUsers < ActiveRecord::Migration
  def change
    add_column :users, :spotify_token, :string
  end
end
