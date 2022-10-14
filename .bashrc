#!/bin/bash
stty -ixon # Disable ctrl-s and ctrl-q.
shopt -s autocd #Allows you to cd into directory merely by typing the directory name.
HISTSIZE= HISTFILESIZE= # Infinite history.
PS1_START='\[\033[01;30m\]\u\[\033[01;30m\]@\[\033[01;30m\]\h\[\033[01;30m\]:\[\033[01;30m\]\w'
PS1_END='\n\[\033[01;32m\]\$\[\033[00m\]'
export PS1=${PS1_START}${PS1_END}

[ -f ~/.fzf.bash ] && source ~/.fzf.bash

# Created by `userpath` on 2020-08-05 21:44:22
export PATH="$PATH:/Users/deanandreakis/.local/bin"
. "$HOME/.cargo/env"
