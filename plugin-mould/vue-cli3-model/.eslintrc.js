module.exports = {
  root: true,
  env: { es6: true, node: true, browser: true },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['plugin:vue/recommended', 'airbnb-base'],
  rules: {
    'linebreak-style': 0, // 操作系统差异，忽略
    'global-require': 0, // 暂时离不开require
    'no-use-before-define': 0, // 忽略
    'no-underscore-dangle': 0, // 命名允许下划线
    'no-return-assign': ['error', 'except-parens'], // 除非返回时使用括号，否则不允许返回赋值
    'no-unused-expressions': 0, // 消除对程序状态没有影响的未使用的表达式
    /* 主观风格,考虑到每个人编辑器配置不同，尤其是格式化风格，暂时禁用 */
    'arrow-body-style': 0, // 强制或禁止在箭头函数体的周围使用大括号
    'no-shadow': 0, // 消除阴影变量声明
    'no-bitwise': 0, // 不允许按位运算符
    'max-len': [
      'error',
      { code: 180, ignoreStrings: true, ignoreComments: true }
    ], // 强制执行最大行长度
    'object-curly-newline': 0,
    'function-paren-newline': 0,
    'no-trailing-spaces': 0, // 有些规则需要换行，与vue推荐规则有点冲突
    'object-curly-spacing': 0,
    'class-methods-use-this': 0,
    'no-mixed-operators': 0,
    'no-restricted-syntax': 0,
    'comma-dangle': 0,
    'object-shorthand': ['error', 'properties'], // 当键与属性名称一样的时候，强制使用对象字面量简写
    'arrow-parens': ['error', 'as-needed'], // 参数只有一个时，箭头函数允许省略括号
    'import/extensions': 0, // 取消对文件扩展名的验证
    "import/no-dynamic-require": 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    // disallow reassignment of function parameters disallow parameter object
    // manipulation except for specific exclusions
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e' // for e.returnvalue
        ]
      }
    ],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'vue/html-self-closing': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
};
