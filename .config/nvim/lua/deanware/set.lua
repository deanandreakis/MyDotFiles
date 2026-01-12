vim.opt.tabstop = 2
vim.opt.softtabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true

vim.opt.smartindent = true

vim.opt.wrap = true

vim.opt.hlsearch = true
vim.opt.incsearch = true

vim.opt.termguicolors = true

vim.opt.scrolloff = 8
vim.opt.signcolumn = "yes"
vim.opt.isfname:append("@-@")

vim.opt.updatetime = 50

vim.opt.syntax = "on"
--vim.opt.background = ""
vim.opt.backup = true
vim.opt.backupdir = "/tmp"
vim.opt.directory = "/tmp"
vim.opt.hidden = true
vim.opt.wildmenu = true
vim.opt.showcmd = true
vim.opt.ignorecase = true
vim.opt.smartcase = true
vim.opt.backspace = [[indent,eol,start]]
vim.opt.autoindent = true
vim.opt.ruler = true
vim.opt.laststatus = 2
vim.opt.confirm = true
vim.opt.visualbell = true
vim.opt.mouse = 'a'
vim.opt.cmdheight = 2
vim.opt.autochdir = true
vim.opt.copyindent = true
vim.opt.smartindent = true
-- disable netrw at the very start of your init.lua (strongly advised)
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1
vim.g.t_Co = 256
