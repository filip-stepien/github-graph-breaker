import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

const baseConfig = [pluginJs.configs.recommended, ...tseslint.configs.strict];

export default baseConfig;
