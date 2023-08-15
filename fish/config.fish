set -gx fish_greeting
set -gx fish_prompt_pwd_dir_length 0

set -gx TERM xterm-256color
set -gx COLORTERM truecolor

set -gx RUSTUP_DIST_SERVER https://mirror.sjtu.edu.cn/rust-static
set -gx RUSTUP_UPDATE_ROOT https://mirror.sjtu.edu.cn/rust-static/rustup

test -e ~/.alias && source ~/.alias

test -e /usr/share/doc/find-the-command/ftc.fish && source /usr/share/doc/find-the-command/ftc.fish noprompt quiet
