mp.observe_property("eof-reached", "bool", function(name, value)
    if value then
        mp.set_property_native("fullscreen", false)
    end
end)
