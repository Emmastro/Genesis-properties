import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^(_|ignore)' },
      ],
    },
  },
  {
    ignores: [
      '.next/',
      'media/',
      'src/payload-types.ts',
      'src/migrations/*.json',
      'src/migrations/*_initial.ts',
      'src/app/(payload)/admin/importMap.js',
    ],
  },
]

export default eslintConfig
