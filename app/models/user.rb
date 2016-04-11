class User < ActiveRecord::Base
  	# Include default devise modules. Others available are:
  	# :confirmable, :lockable, :timeoutable and :omniauthable
  	devise :database_authenticatable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

  	def password_required?
  		super && provider.blank?
  	end

  	def update_with_password(params, *options)
  		if encrypted_password.blank?
  			update_attributes(params, *options)
  		else
  			super
  		end
  	end
  	
end
