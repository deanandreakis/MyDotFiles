-- define global leader to be <space>
vim.g.mapleader = " "

-- Toggle NvimTree
vim.api.nvim_set_keymap("n", "<C-o>", ":NvimTreeToggle<CR>", { noremap = true })

-- Telescope find files and grep
vim.api.nvim_set_keymap("n", "<C-p>", ":Telescope find_files hidden=true<CR>", { noremap = true })
vim.api.nvim_set_keymap("n", "<C-r>", ":Telescope live_grep_args<CR>", { noremap = true })

-- Move highlited sections in visual mode (respecting indents)
vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv")
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv")

-- moves then appends line below cursor to the current line and leaves
-- cursor at beginning of line
vim.keymap.set("n", "J", "mzJ`z")

-- half page vertical jumps but leaves cursor in the middle
vim.keymap.set("n", "<C-d>", "<C-d>zz")
vim.keymap.set("n", "<C-u>", "<C-u>zz")

-- allows search terms to stay in the middle of the page (cursor stays
-- in the middle)
vim.keymap.set("n", "n", "nzzzv")
vim.keymap.set("n", "N", "Nzzzv")

-- when pasting/replacing a highlited selection, using this will
-- keep the original yanked text in the paste buffer
vim.keymap.set("x", "<leader>p", [["_dP]])

-- Copy into system copy buffer
vim.keymap.set({ "n", "v" }, "<leader>y", [["+y]])
vim.keymap.set("n", "<leader>Y", [["+Y]])

-- delete into the void register
vim.keymap.set({ "n", "v" }, "<leader>d", [["_d]])

-- make "Q" do nothing
vim.keymap.set("n", "Q", "<nop>")

-- format the current buffer
vim.keymap.set("n", "<leader>f", vim.lsp.buf.format)

-- opens a global search and replace on item under the cursor
vim.keymap.set("n", "<leader>s", [[:%s/\<<C-r><C-w>\>/<C-r><C-w>/gI<Left><Left><Left>]])
