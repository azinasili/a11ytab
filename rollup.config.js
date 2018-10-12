import { eslint } from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

const banner = `/*!
 * ${capitalizeFirstLetter(pkg.name)} v${pkg.version}
 * (c) 2017-${new Date().getFullYear()} ${pkg.author}
 * MIT License.
 */
`;

export default {
  input: `src/${pkg.name}.js`,
  output: [
    {
      banner,
      file: pkg.main,
      format: 'umd',
      name: `${capitalizeFirstLetter(pkg.name)}`,
    },
    {
      banner,
      file: pkg.module,
      format: 'es',
    },
  ],
  plugins: [
    eslint({
      include: '{src,tests}/**/*.js',
      throwOnError: true,
      throwOnWarning: true,
    }),
    babel(),
  ],
};
