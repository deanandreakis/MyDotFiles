export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced

# Fastlane
export PATH="$HOME/.fastlane/bin:$PATH"

# ruby (installed by Homebrew)
export PATH="/usr/local/opt/ruby/bin:$PATH"
export LDFLAGS="-L/usr/local/opt/ruby/lib"
export CPPFLAGS="-I/usr/local/opt/ruby/include"
export PKG_CONFIG_PATH="/usr/local/opt/ruby/lib/pkgconfig"

if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
        . "$HOME/.bashrc"
    fi
fi

# MacPorts Installer addition on 2020-03-14_at_11:04:37: adding an appropriate PATH variable for use with MacPorts.
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
# Finished adapting your PATH environment variable for use with MacPorts.

# For autopep8 and pycodestyle
export PATH="$HOME/Library/Python/3.8/bin:$PATH"

# Created by `userpath` on 2020-08-05 21:44:22 for use with python virtualenv
export PATH="$PATH:/Users/deanandreakis/.local/bin"

export FZF_DEFAULT_COMMAND='rg --files --no-ignore-vcs --hidden'
