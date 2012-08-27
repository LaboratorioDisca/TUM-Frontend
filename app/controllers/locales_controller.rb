class LocalesController < ApplicationController
    
  def spanish
    I18n.locale = :es_MX
    finish_request
  end
  
  def english
    I18n.locale = :en
    finish_request
  end
  
  private
  def finish_request
    redirect_to :back
  end
end
