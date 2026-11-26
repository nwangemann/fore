const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  { ignores: ['dist/*', 'public/*', '.expo/*'] },
  expo,
  prettier,
  {
    files: ['src/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            'react',
            'react-*',
            'expo*',
            '@/features/*',
            '@/ui/*',
            '@/services/*',
            '@/state/*',
          ],
        },
      ],
    },
  },
]);
