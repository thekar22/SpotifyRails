class OmniauthCallbacksController < Devise::OmniauthCallbacksController
	
 	def user_params
       params.require(:user).permit(:username, :email, :password, :password_confirmation)
	end

	def all 
		email = auth_hash['info']['email']
    	user = User.find_or_create_by(:email => email)    	
		session["spotify_data"] = RSpotify::User.new(request.env['omniauth.auth'])
    	authenticated = User.find_by_provider_and_uid(auth_hash['provider'], auth_hash['uid']);

    	if !authenticated
    		user.provider = auth_hash['provider']
    		user.uid = auth_hash['uid']
      end
    	
    	access_token = auth_hash['credentials']['token']
    	if (auth_hash['provider'] == 'spotify' && user.spotify_token != access_token)
      		user.spotify_token = access_token
    	end

    	user.save
    	sign_in_and_redirect(:user, user)
	end

	alias_method :spotify, :all

	protected

 	def auth_hash
    	request.env['omniauth.auth']
 	end
end