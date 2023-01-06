export LANG='en_US.UTF-8'
export LANGUAGE='en_US:en'
export LC_ALL='en_US.UTF-8'
export TERM=xterm-256color

if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

if [[ $ZSH_OS != "nixos" ]]
then
  export ZSH="$HOME/.oh-my-zsh"
  ZSH_THEME="powerlevel10k/powerlevel10k"
  plugins=(git)
  source $ZSH/oh-my-zsh.sh
fi

# For FZF
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
# FZF default command
export FZF_DEFAULT_COMMAND='rg --files --no-ignore-vcs --hidden'


if [[ "$OSTYPE" = darwin* ]]; then

  # Fastlane (installed by Homebrew)
  export PATH="$HOME/.fastlane/bin:$PATH"

  # ruby (installed by Homebrew)
  export PATH="/usr/local/opt/ruby/bin:$PATH"
  export PATH="$HOME/.gem/ruby/3.1.0/bin:$PATH"
  export PATH="/usr/local/lib/ruby/gems/3.1.0/bin:$PATH"
  export LDFLAGS="-L/usr/local/opt/ruby/lib"
  export CPPFLAGS="-I/usr/local/opt/ruby/include"
  export PKG_CONFIG_PATH="/usr/local/opt/ruby/lib/pkgconfig"

  # For autopep8 and pycodestyle
  export PATH="$HOME/Library/Python/3.8/bin:$PATH"

  # Created by `userpath` on 2020-08-05 21:44:22 for use with python virtualenv
  export PATH="$PATH:/Users/deanandreakis/.local/bin"

   # GCP Cloud CLI
  source "/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.zsh.inc"
  source "/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/completion.zsh.inc"

  test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"
  eval "$(rbenv init - zsh)"
fi

# Preferred editor for local and remote sessions
if [[ -n $SSH_CONNECTION ]]; then
  export EDITOR='vim'
else
  export EDITOR='nvim'
fi

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
