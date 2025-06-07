export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        // définir ici les variables globales Node.js
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        // ajoute d'autres si besoin
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
    },
    rules: {
      // tes règles ici
    },
  },
];
