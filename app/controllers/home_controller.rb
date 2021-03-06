class HomeController < ApplicationController
	before_action :set_spotify_user

	# stub method main page after oauth log in
	def index
		
	end

	# return to caller json list of user playlist metadata
	def getPlaylists
		userid = current_user.uid
		playlists = GetPlaylistMetadataFromSpotify.build.call(session["devise.spotify_data"])
		Playlist.sync_playlists(playlists, userid)
		render json: playlists
	end

	# return to caller json unique song list from playlists given playlist ids
	def getTagUnion
		playlistids = params[:playlistids]
		songs = []
		userid = current_user.uid
		playlistids.each do |playlistid|
			result = Playlist.get_playlist_songs(playlistid, userid)
			songs += result
		end		
		songs = songs.compact.uniq { |t| t.id }
		render json: songs
	end

	# return to caller json list of songs shared between given playlist ids
	def getTagIntersection
		playlistids = params[:playlistids]
		playlists = []
		userid = current_user.uid
		playlistids.each do |playlistid|
			songs = Playlist.get_playlist_songs(playlistid, userid)
			playlists.push(songs)
		end		
		intersection = Playlist.intersect_playlists(playlists)
		render json: intersection
	end

	# return to caller json list of songfeatures for each song id
	def getAudioFeatures
		userid = current_user.uid
		songids = params[:songIds]
		audio_features = GetAudioFeaturesFromSpotify.build.call(songids)
		render json: audio_features
	end

	# return to caller json list of tracks given search query
	def getQuery
		query = params[:query]
		results = GetQueryFromSpotify.build.call(query)
		render json: results
	end

	# return to caller json of song
	def getSong
		id = params[:songId]
		result = GetSongFromSpotify.build.call(id)
		render json: result
	end

	def addNewTagForSong
		tagname = params[:tagName]
		songid = params[:songId]
		userid = current_user.uid
			
		spotify_playlist = CreateSpotifyPlaylist.build.call(session["devise.spotify_data"], tagname)
		
		if !songid.empty?
			UserSongTagging.add_tag_to_song(userid, spotify_playlist, songid)
		end

		db_playlist = Playlist.create(playlist_id: spotify_playlist.id, name: spotify_playlist.name, 
			owner_id: spotify_playlist.owner.id, snapshot_id: spotify_playlist.snapshot_id,
			total: spotify_playlist.total, collaborative: spotify_playlist.collaborative, public: spotify_playlist.public, stale: true)

		render json: db_playlist
	end

	def addExistingTagForSong
		playlistid = params[:tagId]
		songid = params[:songId]
		userid = current_user.uid

		spotify_playlist = GetPlaylistFromSpotifyById.build.call(playlistid, userid)
		playlist = UserSongTagging.add_tag_to_song(userid, spotify_playlist, songid)

		db_playlist = Playlist.get(playlistid)
		db_playlist.stale = true
		db_playlist.save

		render json: db_playlist
	end

	def addExistingTagForSongs
		tagid = params[:tagId]
		songids = params[:songIds]
		userid = current_user.uid

		spotify_playlist = GetPlaylistFromSpotifyById.build.call(tagid, userid)
		playlist = UserSongTagging.add_tag_to_songs(userid,spotify_playlist,songids)

		db_playlist = Playlist.get(tagid)
		db_playlist.stale = true
		db_playlist.save

		render json: db_playlist
	end

	def removeTagForSong
		tagid = params[:tagId]
		songid = params[:songId]
		userid = current_user.uid

		playlist = GetPlaylistFromSpotifyById.build.call(tagid, userid)
		song = GetSongFromSpotify.build.call(songid)

		RemoveSongFromPlaylistFromSpotify.build.call(song, playlist)
		UserSongTagging.remove_tag_from_song(userid, tagid, songid)
		render json: true
	end

	def deleteTag
		tagid = params[:tagId]
		userid = current_user.uid

		spotify_user =  RSpotify::User.find(userid)
		spotify_playlist = GetPlaylistFromSpotifyById.build.call(tagid, userid)
		
		spotify_user.unfollow(spotify_playlist)
		db_playlist = Playlist.get(tagid)
		if db_playlist.present?
			db_playlist.delete
		end

		UserSongTagging.remove_tag(userid, tagid)
		render json: true
	end

	# return to caller json all tags to which song belongs
	def getCurrentTagsForSong
		songid = params[:songId]
		userid = current_user.uid
		tags = UserSongTagging.get_tags_for_song(userid, songid)
		db_playlists = tags.map { |tag| tag.playlist}

		render json: db_playlists
	end

	def getRecommendations

		audio_feature_dict = {}

		if params[:seedTracks].present?
			track_ids = params[:seedTracks].values.map do |track| track["song_id"] end
		else
			raise ArgumentError.new('no seed tracks provided')  
		end

		if params[:audioFeatures].present?
			params[:audioFeatures].values.each do |feature| audio_feature_dict[feature["name"]] = feature["score"] end
		else
			raise ArgumentError.new('no audio features provided')  
		end

		recommendations = RSpotify::Recommendations.generate(seed_tracks: track_ids, 
			target_valence: audio_feature_dict["Valence"], 
			target_instrumentalness: audio_feature_dict['Instrumentalness'],
			target_energy: audio_feature_dict['Energy'], 
			target_acousticness: audio_feature_dict['Acousticness'], 
			target_danceability: audio_feature_dict['Danceability'] )
		
		render json: recommendations
	end

	# spotify user created from oauth will be saved in current devise session; will be removed when devise next clears session
	def set_spotify_user
		if session["spotify_data"]
			session["devise.spotify_data"] = RSpotify::User.new(session["spotify_data"])
			session["spotify_data"] = nil
		elsif session["devise.spotify_data"]
			session["devise.spotify_data"] = RSpotify::User.new(session["devise.spotify_data"])
		end

		 if !session["devise.spotify_data"]
		 	if !action_name.eql? "index"
		 		# redirect to index if oauth not set properly
		 		redirect_to action: "index"
		 	end
		 end
	end
end