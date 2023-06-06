const babel = require('@babel/core');
const path = require('path');
const babelPluginAntdStyle = require('./index');

const file = path.resolve(__dirname, '../demo/page/index.tsx');

const obj = babel.transformFileSync(file, {
  presets: ['@babel/preset-typescript'],
  plugins: [babelPluginAntdStyle],
});

console.log(obj.code);
