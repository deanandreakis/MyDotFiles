export LANG='en_US.UTF-8'
export LANGUAGE='en_US:en'
export LC_ALL='en_US.UTF-8'
export TERM=xterm-256color

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

  # Fastlane (installed by Homebrew)
  export PATH="$HOME/.fastlane/bin:$PATH"

  # For autopep8 and pycodestyle
  export PATH="$HOME/Library/Python/3.8/bin:$PATH"

  # Created by `userpath` on 2020-08-05 21:44:22 for use with python virtualenv
  export PATH="$PATH:/Users/deanandreakis/.local/bin"

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

# opam configuration
[[ ! -r /Users/deanandreakis/.opam/opam-init/init.zsh ]] || source /Users/deanandreakis/.opam/opam-init/init.zsh  > /dev/null 2> /dev/null
