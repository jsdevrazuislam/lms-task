import eslint from '@eslint/js';
import tslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default tslint.config(
    eslint.configs.recommended,
    ...tslint.configs.recommended,
    {
        plugins: {
            import: importPlugin,
            prettier: prettierPlugin,
        },
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            'prettier/prettier': 'error',
            'import/no-unresolved': 'off',
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
    configPrettier,
    {
        ignores: ['dist/**', 'node_modules/**', 'vitest.config.ts', 'eslint.config.mjs'],
    }
);
