// eslint.config.mjs
import antfu from "@antfu/eslint-config"

export default antfu({
  vue: {
    overrides: {
      "vue/block-order": ["error", {
        order: ["template", "script", "style"],
      }],
    },
  },
  stylistic: {
    quotes: "double",
  },
  formatters: true,
  lessOpinionated: true,
})
