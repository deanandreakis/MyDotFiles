vim.g.coq_settings = {
  auto_start = 'shut-up',
  keymap = {
    recommended = false,
    jump_to_mark = "<c-,>"
  },
  clients = {
    paths = {
      path_seps = {
        "/"
      }
    },
    buffers = {
      match_syms = true
    }
  },
  display = {
    ghost_text = {
      enabled = true
    }
  }
}
local coq = require("coq")

require("coq_3p") {
  { src = "nvimlua", short_name = "nLUA" },
  { src = "builtin/c"       },
  { src = "builtin/html"       },
  { src = "builtin/css"       },
  { src = "builtin/js"       },
}
