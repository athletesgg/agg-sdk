module.exports = {
  env: {
    node: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.json',
    ],
  },
  plugins: [
    '@typescript-eslint',
    'jest',
    'sort-destructure-keys',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
  ],
  rules: {
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
        },
      },
    ],
    '@typescript-eslint/semi': [
      'error',
      'never',
    ],
    'array-bracket-newline': [2, {
      'minItems': 1
    }],
    'array-element-newline': [2, {
      'minItems': 1
    }],
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'no-console': 2,
    'no-mixed-operators': 0,
    'no-nested-ternary': 0,
    'no-plusplus': 0,
    'no-underscore-dangle': 0,
    'object-curly-newline': [2, {
      'ObjectExpression': {
        'multiline': true,
        'minProperties': 1
      },
      'ObjectPattern': 'always',
      'ImportDeclaration': 'always',
      'ExportDeclaration': 'always'
    }],
    'object-property-newline': [
      2,
      {
        'allowAllPropertiesOnSameLine': false
      }
    ],
    'semi': 'off',
    'sort-destructure-keys/sort-destructure-keys': [
      2,
      {
        'caseSensitive': true
      }
    ],
    'sort-keys': [
      'error',
      'asc',
      {
        'caseSensitive': true,
        'natural': true
      }
    ]
  }
}
