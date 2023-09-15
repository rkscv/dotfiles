set -gx fish_greeting
set -gx fish_prompt_pwd_dir_length 0

set -gx TERM xterm-256color
set -gx COLORTERM truecolor

test -e ~/.alias && source ~/.alias

test -e /usr/share/doc/find-the-command/ftc.fish && source /usr/share/doc/find-the-command/ftc.fish noprompt quiet
