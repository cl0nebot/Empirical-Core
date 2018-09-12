class Apps::GrammarController < ApplicationController
  before_action :staff!, only: :staff
  
  def play

  end

  def staff
    @js_file = 'apps'
  end

end