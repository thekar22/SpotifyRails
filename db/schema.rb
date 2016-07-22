# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160718104220) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "playlists", force: :cascade do |t|
    t.string   "playlist_id"
    t.string   "name"
    t.string   "owner_id"
    t.string   "snapshot_id"
    t.integer  "total"
    t.boolean  "collaborative"
    t.integer  "followers"
    t.boolean  "public"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.boolean  "stale"
  end

  add_index "playlists", ["owner_id"], name: "index_playlists_on_owner_id", using: :btree
  add_index "playlists", ["playlist_id"], name: "index_playlists_on_playlist_id", using: :btree

  create_table "songs", force: :cascade do |t|
    t.string   "song_id"
    t.string   "name"
    t.string   "album_id"
    t.integer  "duration_ms"
    t.string   "artist"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "songs", ["song_id"], name: "index_songs_on_song_id", using: :btree

  create_table "user_song_taggings", force: :cascade do |t|
    t.string   "song_id"
    t.string   "playlist_id"
    t.string   "user_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "user_song_taggings", ["playlist_id"], name: "index_user_song_taggings_on_playlist_id", using: :btree
  add_index "user_song_taggings", ["song_id"], name: "index_user_song_taggings_on_song_id", using: :btree
  add_index "user_song_taggings", ["user_id"], name: "index_user_song_taggings_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "provider"
    t.string   "uid"
    t.string   "spotify_token"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["uid"], name: "index_users_on_uid", using: :btree

end
