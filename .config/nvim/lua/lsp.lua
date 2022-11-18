require("mason").setup({
  PATH = "prepend",
})
require("mason-lspconfig").setup()

-- After setting up mason-lspconfig you may set up servers via lspconfig
-- require("lspconfig").sumneko_lua.setup {}
-- require("lspconfig").rust_analyzer.setup {}
--
-- Language Server Setup

--rust
require'lspconfig'.rust_analyzer.setup {}

--lua
require'lspconfig'.sumneko_lua.setup{}

--ruby
require'lspconfig'.solargraph.setup{}

--javascript/typescript/jsx...
require'lspconfig'.eslint.setup{}

--css/scss/less
require'lspconfig'.cssls.setup{}

--html
require'lspconfig'.emmet_ls.setup{}

--swift/obj-c
require'lspconfig'.sourcekit.setup{}

--kotlin
require'lspconfig'.kotlin_language_server.setup{}

--java
require'lspconfig'.jdtls.setup{}

--python
require'lspconfig'.pyright.setup{}
