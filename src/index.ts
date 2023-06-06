import * as t from '@babel/types';

export default function babelPluginAntdStyle() {
  let hasImportAntdStyle = false;
  return {
    visitor: {
      ImportDeclaration(path: any) {
        if (path.type !== 'ImportDeclaration') {
          return;
        }
        const value = path.node.source.value;
        if (
          value === 'antd-style' &&
          path.node.specifiers.find(
            (item: any) => item.imported?.name === 'createStyles'
          )
        ) {
          hasImportAntdStyle = true;
        }
      },
      CallExpression(path: any, state: any) {
        const fileName = (state.file.opts.filename as string).replace(
          state.file.opts.root as string,
          ''
        );
        if (!hasImportAntdStyle) return;
        if (path.node.callee.name !== 'createStyles') return;
        const __BABEL_FILE_NAME__ = t.objectExpression([
          t.objectProperty(
            t.identifier('__BABEL_FILE_NAME__'),
            t.stringLiteral(
              (fileName as string)
                .split('/')
                .map((path) => path.split('.').at(0))
                .filter((path) => path && path !== 'src' && path !== 'index')
                .join('-')
            )
          ),
        ]);
        if (path.node.arguments.length === 1) {
          path.node.arguments.push(__BABEL_FILE_NAME__);
          return;
        }
        if (path.node.arguments.length === 2) {
          const properties = path.node.arguments[1].properties;
          if (
            properties.find(
              (item: any) => item.key.name !== '__BABEL_FILE_NAME__'
            )
          ) {
            return;
          } else {
            properties.push(__BABEL_FILE_NAME__);
          }
          return;
        }
      },
    },
  };
}
