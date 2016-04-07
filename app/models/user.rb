class User < ActiveRecord::Base
  	# Include default devise modules. Others available are:
  	# :confirmable, :lockable, :timeoutable and :omniauthable
  	devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

	def self.from_omniauth(auth)
  		#currently not being used
  		where(auth.slice(:provider, :uid)).first_or_create do |user|
  		
  		user.provider = auth.provider
  		user.uid = auth.uid
  		user.username = auth.info.name
  		end
  	end
end
