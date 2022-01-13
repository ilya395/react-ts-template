module.exports = {
  env: {
    browser: true,
  },
  extends: ['airbnb', 'airbnb/hooks', 'react-app', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier', 'react', '@typescript-eslint'],
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': 'error', // смотрим за не использованными переменными
    'no-console': 'warn', // 'error'
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx', '.ts', '.js'] }], // где используем jsx
    'import/extensions': [
      // не указываем расширения при импорте файлов
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'react/jsx-props-no-spreading': 'off', // потомучто деструкторизация - збс, и пропсы удобно прокидывать
    camelcase: 'warn', // поомучто пременные в js и так горбатые, а стили хоть немного по бэму
    'no-shadow': 'off',
    'react-hooks/rules-of-hooks': 'warn', // Проверяем правила хуков -> лучше поставить error на будущее
    'react-hooks/exhaustive-deps': 'warn', // Проверяем зависимости эффекта
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    'arrow-body-style': ['error', 'as-needed', {
      requireReturnForObjectLiteral: false,
    }],
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
};