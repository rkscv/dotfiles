#!/usr/bin/env fish
cd (status dirname)
for arg in $argv
    switch $arg
        case fish mpv
            mkdir -p ~/.config/$arg
            ln -sfr $arg/* ~/.config/$arg/
        case cargo
            envsubst <cargo/config.toml >~/.cargo/config.toml
        case pip
            pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
        case pnpm
            pnpm config set registry https://registry.npmmirror.com
        case go
            go env -w GOPATH="$HOME/.go"
            go env -w GOMODCACHE="$HOME/.go/pkg/mod"
            go env -w GO111MODULE=on
            go env -w GOPROXY=https://goproxy.cn,direct
        case '*'
            echo unknown target: $arg
    end
end
