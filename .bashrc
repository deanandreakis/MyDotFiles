# To the extent possible under law, the author(s) have dedicated all 
# copyright and related and neighboring rights to this software to the 
# public domain worldwide. This software is distributed without any warranty. 
# You should have received a copy of the CC0 Public Domain Dedication along 
# with this software. 
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>. 

# base-files version 4.1-1

# ~/.bashrc: executed by bash(1) for interactive shells.

# The latest version as installed by the Cygwin Setup program can
# always be found at /etc/defaults/etc/skel/.bashrc

# Modifying /etc/skel/.bashrc directly will prevent
# setup from updating it.

# The copy in your home directory (~/.bashrc) is yours, please
# feel free to customise it to create a shell
# environment to your liking.  If you feel a change
# would be benifitial to all, please feel free to send
# a patch to the cygwin mailing list.

# User dependent .bashrc file

if [ -t 1 ]; then
  cd ~
fi

# If not running interactively, don't do anything
[[ "$-" != *i* ]] && return

# Shell Options
#
# See man bash for more options...
#
# Don't wait for job termination notification
# set -o notify
#
# Don't use ^D to exit
# set -o ignoreeof
#
# Use case-insensitive filename globbing
# shopt -s nocaseglob
#
# Make bash append rather than overwrite the history on disk
# shopt -s histappend
#
# When changing directory small typos can be ignored by bash
# for example, cd /vr/lgo/apaache would find /var/log/apache
shopt -s cdspell

# Completion options
#
# These completion tuning parameters change the default behavior of bash_completion:
#
# Define to access remotely checked-out files over passwordless ssh for CVS
# COMP_CVS_REMOTE=1
#
# Define to avoid stripping description in --option=description of './configure --help'
# COMP_CONFIGURE_HINTS=1
#
# Define to avoid flattening internal contents of tar files
# COMP_TAR_INTERNAL_PATHS=1
#
# Uncomment to turn on programmable completion enhancements.
# Any completions you add in ~/.bash_completion are sourced last.
# [[ -f /etc/bash_completion ]] && . /etc/bash_completion

# History Options
#
# Don't put duplicate lines in the history.
export HISTCONTROL=$HISTCONTROL${HISTCONTROL+,}ignoredups
#
# Ignore some controlling instructions
# HISTIGNORE is a colon-delimited list of patterns which should be excluded.
# The '&' is a special pattern which suppresses duplicate entries.
export HISTIGNORE=$'[ \t]*:&:[fb]g:exit'
export HISTIGNORE=$'[ \t]*:&:[fb]g:exit:ls' # Ignore the ls command as well
#
# Whenever displaying the prompt, write the previous line to disk
# export PROMPT_COMMAND="history -a"

# Aliases
#
# Some people use a different file for aliases
# if [ -f "${HOME}/.bash_aliases" ]; then
#   source "${HOME}/.bash_aliases"
# fi
#
# Some example alias instructions
# If these are enabled they will be used instead of any instructions
# they may mask.  For example, alias rm='rm -i' will mask the rm
# application.  To override the alias instruction use a \ before, ie
# \rm will call the real rm not the alias.
#
# Interactive operation...
# alias rm='rm -i'
# alias cp='cp -i'
# alias mv='mv -i'
#
# Default to human readable figures
# alias df='df -h'
# alias du='du -h'
#
# Misc :)
# alias less='less -r'                          # raw control characters
# alias whence='type -a'                        # where, of a sort
# alias grep='grep --color'                     # show differences in colour
# alias egrep='egrep --color=auto'              # show differences in colour
# alias fgrep='fgrep --color=auto'              # show differences in colour
#
# Some shortcuts for different directory listings
export LS_OPTIONS='--color=auto'
eval "$(dircolors -b)"
alias ls='ls $LS_OPTIONS'
LS_COLORS=$LS_COLORS:'ow=01;34:di=01;34;40:' ; export LS_COLORS
#alias ls='ls -hF --color=tty'                 # classify files in colour
# alias dir='ls --color=auto --format=vertical'
# alias vdir='ls --color=auto --format=long'
# alias ll='ls -l'                              # long list
# alias la='ls -A'                              # all but . and ..
# alias l='ls -CF'                              #

# Umask
#
# /etc/profile sets 022, removing write perms to group + others.
# Set a more restrictive umask: i.e. no exec perms for others:
# umask 027
# Paranoid: neither group nor others have any perms:
# umask 077

# Functions
#
# Some people use a different file for functions
# if [ -f "${HOME}/.bash_functions" ]; then
#   source "${HOME}/.bash_functions"
# fi
#
# Some example functions:
#
# a) function settitle
 settitle () 
 { 
   echo -ne "\e]2;$@\a\e]1;$@\a"; 
 }
# 
# b) function cd_func
# This function defines a 'cd' replacement function capable of keeping, 
# displaying and accessing history of visited directories, up to 10 entries.
# To use it, uncomment it, source this file and try 'cd --'.
# acd_func 1.0.5, 10-nov-2004
# Petar Marinov, http:/geocities.com/h2428, this is public domain
# cd_func ()
# {
#   local x2 the_new_dir adir index
#   local -i cnt
# 
#   if [[ $1 ==  "--" ]]; then
#     dirs -v
#     return 0
#   fi
# 
#   the_new_dir=$1
#   [[ -z $1 ]] && the_new_dir=$HOME
# 
#   if [[ ${the_new_dir:0:1} == '-' ]]; then
#     #
#     # Extract dir N from dirs
#     index=${the_new_dir:1}
#     [[ -z $index ]] && index=1
#     adir=$(dirs +$index)
#     [[ -z $adir ]] && return 1
#     the_new_dir=$adir
#   fi
# 
#   #
#   # '~' has to be substituted by ${HOME}
#   [[ ${the_new_dir:0:1} == '~' ]] && the_new_dir="${HOME}${the_new_dir:1}"
# 
#   #
#   # Now change to the new dir and add to the top of the stack
#   pushd "${the_new_dir}" > /dev/null
#   [[ $? -ne 0 ]] && return 1
#   the_new_dir=$(pwd)
# 
#   #
#   # Trim down everything beyond 11th entry
#   popd -n +11 2>/dev/null 1>/dev/null
# 
#   #
#   # Remove any other occurence of this dir, skipping the top of the stack
#   for ((cnt=1; cnt <= 10; cnt++)); do
#     x2=$(dirs +${cnt} 2>/dev/null)
#     [[ $? -ne 0 ]] && return 0
#     [[ ${x2:0:1} == '~' ]] && x2="${HOME}${x2:1}"
#     if [[ "${x2}" == "${the_new_dir}" ]]; then
#       popd -n +$cnt 2>/dev/null 1>/dev/null
#       cnt=cnt-1
#     fi
#   done
# 
#   return 0
# }
# 
alias docs='cd /mnt/c/Users/979603/Documents'
alias dtop='cd /mnt/c/Users/979603/Desktop'
PATH=".:"$PATH

###########TRAAP DOC BLD STUFF#############################
#note that chocolaty installed this in the PATH when it installed
#miktex so no need for it here
#export miktex="/cygdrive/c/Program Files/MiKTeX 2.9/miktex/bin/x64"
#PATH= $PATH:"$miktex"
export HOMEDRIVE=C:

AUTODOCPATH=${HOME}/git/autodoc
export AUTODOCPATH

NEWDOCPATH=${HOME}/git/newdoc
export NEWDOCPATH

DOCBLDPATH=${HOME}/git/docbld
export DOCBLDPATH

function docbld() {
  rake --rakefile ${DOCBLDPATH}/Rakefile $1
}

function newdoc() {
  ${NEWDOCPATH}/newdoc "$@"
}
function newdata() {
  ${DOCBLDPATH}/bin/newdata
}

AMBERPATH=${HOME}/git/amber
export AMBERPATH
function newfactoryitem() {
  ${AMBERPATH}/bin/newfactoryitem $@
}
function check-test-output() {
  echo grep -rw --include=\s*.* test-output/ -e $1
  grep -rw --include=\s*.* test-output/ -e $1
}
function pass() {
  check-test-output PASS
}
function fail() {
  check-test-output FAIL
}

# ------------------------------------------------------------------------------
# A to check for the existiance of a program on my path.
# ------------------------------------------------------------------------------
programExists() {
  which "$1" &> /dev/null ;
}

# ------------------------------------------------------------------------------
# Generating a new SSH key and adding it to the ssh-agent
# https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent
# ------------------------------------------------------------------------------
sshkey (){
  ssh-add ~/.ssh/id_rsa
}

sshlist() {
  ps -e | awk '/ssh-agent/'
}

sshkill() {
  for pid in $(ps -ef | awk '/ssh-agent/ {print $2}'); do kill -9 $pid; done
}

sshstart() {
  SSHAGENT=/usr/bin/ssh-agent
  SSHAGENTARGS="-s"
  if [ -z "$SSH_AUTH_SOCK" -a -x "$SSHAGENT" ]; then
  	eval `$SSHAGENT $SSHAGENTARGS`
  	trap "kill $SSH_AGENT_PID" 0
  fi
}

export DISPLAY=localhost:0.0

#export PATH="$PATH:/mnt/c/Windows/Microsoft.NET/Framework/v4.0.30319"

#GIT_PROMPT_ONLY_IN_REPO=1
#source ~/.bash-git-prompt/gitprompt.sh

PS1_START='\[\033[01;32m\]\u\[\033[01;33m\]@\[\033[01;35m\]\h\[\033[01;32m\]:\[\033[01;36m\]\w'
PS1_END='\n\[\033[01;36m\]\$\[\033[00m\]'
export PS1=${PS1_START}${PS1_END}

prompt() {
  GIT_PROMPT_ONLY_IN_REPO=1
  GIT_PROMPT_START=${PS1_START}
  GIT_PROMPT_END=${PS1_END}
}

if [[ ${OSTYPE} =~ "darwin" ]]; then
  if [[ -f $(brew --prefix)/opt/bash-git-prompt/share/gitprompt.sh ]]; then
    prompt
    source "$(brew --prefix)/opt/bash-git-prompt/share/gitprompt.sh"
  fi
elif [[ ${OSTYPE} =~ "linux" ]] ||
     [[ ${OSTYPE} =~ "cygwin" ]] ||
     [[ ${OSTYPE} =~ "msys" ]]; then
  if [[ -f ${HOME}/.bash-git-prompt/gitprompt.sh ]]; then
    prompt
    source ${HOME}/.bash-git-prompt/gitprompt.sh
  fi
fi

VISUAL=vim; export VISUAL EDITOR=vim; export EDITOR
