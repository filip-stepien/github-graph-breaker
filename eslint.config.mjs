import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

const baseConfig = [
    pluginJs.configs.recommended,
    ...tseslint.configs.strictl,
    {
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ]
        }
    }
];

export default baseConfig;
