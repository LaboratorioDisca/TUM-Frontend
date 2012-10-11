class WebController < ApplicationController
	def index
	end
	
	def presentation
	  send_file(Rails.root+"public/PresentacionPumabusMovil.pdf")
	end
end
