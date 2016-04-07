class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
	def all
		raise request.env["omniauth.auth"].to_yaml
	end

	alias_method :facebook :all
end