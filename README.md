
# PollyGlot

**Live site:** [https://qwertydiy2.github.io/pollyglot/](https://qwertydiy2.github.io/pollyglot/)

PollyGlot is a web app for practicing and grading translations between English, French, and Chinese. Instantly translate text, enter your own guess, and get objective, AI-powered feedback—all in a beautiful, responsive interface.

## Features

- Translate text between English, French, and Chinese using OpenAI (gpt-4o)
- Select source and target languages
- Enter your own translation guess
- Objective grading of your guess against the AI translation
- 100% client-side (no backend)


## Production Deployment

The app is automatically deployed to GitHub Pages on every push to `main` using GitHub Actions. Visit the link above to access the latest version.

## Testing for Developers (Self-hosted Runner)

To test the deployment workflow locally or in a private environment:

1. Register a self-hosted runner with your GitHub repo or org.
2. Push to `main` to trigger the `.github/workflows/selfhosted-gh-pages.yml` workflow.
3. The app will be built and deployed using your self-hosted runner.

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open the app:**
   Visit http://localhost:5173 in your browser.

## Configuration

- You will need an OpenAI API key. The app will prompt you to enter it on first use or you can set it in your environment variables.


## License

Business Source License (BUSL)

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
