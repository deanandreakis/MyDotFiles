vim.api.nvim_set_keymap("n", "<C-o>", ":NvimTreeToggle<CR>", { noremap = true })
vim.api.nvim_set_keymap("n", "<C-p>", ":Telescope find_files<CR>", { noremap = true })
vim.api.nvim_set_keymap("n", "<C-r>", ":Telescope live_grep<CR>", { noremap = true })
vim.g.mapleader = ";"
vim.g.maplocalleader = ","
