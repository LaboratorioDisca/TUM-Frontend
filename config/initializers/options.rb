class PumaBusApp
  
  @@locales_enabled = true
  
  def self.locales_enabled=(flag)
    @@locales_enabled = flag
  end
  
  def self.locales_enabled?
    @@locales_enabled
  end
end

PumaBusApp.locales_enabled = false