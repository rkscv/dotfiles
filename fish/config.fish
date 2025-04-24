set -gx fish_greeting
set -gx fish_prompt_pwd_dir_length 0

set -gx TERM xterm-256color
set -gx COLORTERM truecolor

set -x RUSTUP_UPDATE_ROOT https://mirrors.tuna.tsinghua.edu.cn/rustup/rustup
set -x RUSTUP_DIST_SERVER https://mirrors.tuna.tsinghua.edu.cn/rustup

set -gx PNPM_HOME ~/.local/share/pnpm

alias ls='ls -h --classify --color=auto'
alias l='ls'
alias ll='ls -l'
alias la='ls -A'
alias lla='ls -lA'
alias df='df -h'
alias du='du --apparent-size --summarize -h'
alias free='free -h'
alias pgrep='pgrep --list-full'
alias tree='tree --gitignore --metafirst --du -puhDF'
alias bat='bat --wrap=never'
alias su='su --shell=$SHELL'
alias aria2c='aria2c --max-connection-per-server=16 --continue'

alias jrnl-vacuum='sudo journalctl --flush --rotate --vacuum-time'
alias cpv='rsync -r -h --perms --owner --group --partial --progress'
alias unzip-zh='unzip -O GB18030'

function sync_history --on-event fish_preexec
    history merge
end

function =p
    set -gx https_proxy http://127.0.0.1:7890
end

function +p
    set -gx https_proxy http://127.0.0.1:7891
end

function ~p
    set -gx https_proxy
end

function p
    echo $https_proxy
end

=p
