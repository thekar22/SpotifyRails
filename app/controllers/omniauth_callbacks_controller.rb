class OmniauthCallbacksController < Devise::OmniauthCallbacksController
	
 	def user_params
       params.require(:user).permit(:username, :email, :password, :password_confirmation)
	end

	def all
		#raise request.env["omniauth.auth"].to_yaml

		email = auth_hash['info']['email']
    	user = User.find_or_create_by(:email => email)
    	
    	#binding.pry

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

  		#binding.pry

		# user = User.from_omniauth(request.env["omniauth.auth"])

		# if user.persisted?
		# 	sign_in_and_redirect user, notice: "Signed in!"
		# else
		# 	redirect_to new_user_registration_url
		# end

	end

	alias_method :spotify, :all

	protected

 	def auth_hash
    	request.env['omniauth.auth']
 	end
end