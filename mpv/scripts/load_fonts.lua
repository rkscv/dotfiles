local utils = require('mp.utils')

mp.register_script_message('select-sub-fonts-dir', function()
    local path, error = mp.get_property('path')
    if error then return mp.msg.error(error) end
    path = utils.split_path(path)
    local dirs, error = utils.readdir(path, 'dirs')
    if error then return mp.msg.error(error) end

    local menu = {
        title = 'Subtitle font directory',
        items = {}
    }
    for _, dir in ipairs(dirs) do
        table.insert(menu.items, {
            title = dir .. ' /',
            value = { 'set', 'sub-fonts-dir', utils.join_path(path, dir) },
        })
    end
    mp.commandv('script-message-to', 'uosc', 'open-menu', utils.format_json(menu))
end)
