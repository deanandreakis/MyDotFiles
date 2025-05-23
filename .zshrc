export LANG='en_US.UTF-8'
export LANGUAGE='en_US:en'
export LC_ALL='en_US.UTF-8'
export OLLAMA_HOST=0.0.0.0
if [[ $TERM == xterm ]]; then TERM=xterm-256color; fi

if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(git)
source $ZSH/oh-my-zsh.sh

# For FZF
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
# FZF default command
export FZF_DEFAULT_COMMAND='rg --files --no-ignore-vcs --hidden'


if [[ "$OSTYPE" = darwin* ]]; then

  # Homebrew
  export PATH=$HOME/bin:/opt/homebrew/bin:/usr/local/bin:$PATH

  # Created by `userpath` on 2020-08-05 21:44:22 for use with python virtualenv
  export PATH="$PATH:/Users/deanandreakis/.local/bin"

  test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"
  eval "$(rbenv init - zsh)"

  alias vim="nvim"

  export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
fi

# Preferred editor for local and remote sessions
if [[ -n $SSH_CONNECTION ]]; then
  export EDITOR='vim'
else
  export EDITOR='nvim'
fi

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
export PATH=$HOME/.local/bin:$PATH

if [[ "$OSTYPE" = linux* ]]; then
  eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
fi

. "$HOME/.cargo/env"
