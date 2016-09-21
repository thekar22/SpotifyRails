Rails.application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "omniauth_callbacks" }

   as :user do
    get 'users/edit' => 'devise/registrations#edit', :as => 'edit_user_registration'
    put 'users' => 'devise/registrations#update', :as => 'user_registration'
    delete 'users' => 'devise/registrations#destroy', :via => :delete, :as => 'cancel_registration'
  end

  get '/playlists', to: 'home#getPlaylists'
  get '/playlistSongs', to: 'home#getPlaylistSongs'
  get '/tagUnion', to: 'home#getTagUnion'  
  get '/tagIntersection', to: 'home#getTagIntersection'
  get '/currentTags', to: 'home#getCurrentTagsForSong'
  get '/addNewTag', to: 'home#addNewTagForSong'
  get '/addExistingTag', to: 'home#addExistingTagForSong'
  get '/addTagToSongs', to: 'home#addTagForSongIds'
  get '/removeTag', to: 'home#removeTagForSong'
  get '/search', to: 'home#getQuery'
  get '/song', to: 'home#getSong'


  match 'getAudioFeatures' => 'home#getAudioFeatures', via: [:post]
  root 'home#index'
  
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
