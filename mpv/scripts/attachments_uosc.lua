local utils = require('mp.utils')

mp.register_script_message('show-attachments', function()
    local count = mp.get_property_number('user-data/attachments/count', 0)
    local menu = {
        title = 'Matroska attachments',
        items = {}
    }
    for i = 0, count-1 do
        table.insert(menu.items, {
            title = mp.get_property_native('user-data/attachments/' .. i .. '/name'),
            hint = mp.get_property_native('user-data/attachments/' .. i .. '/mime_type'),
        })
    end
    mp.commandv('script-message-to', 'uosc', 'open-menu', utils.format_json(menu))
end)
