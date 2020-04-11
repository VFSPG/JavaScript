module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'node': true,
        'jquery': true,
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'rules': {
        'linebreak-style': [
            'error',
            'unix'
        ],
        'prefer-const' : 2,
        'array-callback-return': 2,      // http://eslint.org/docs/rules/array-callback-return
        'consistent-return': 2,          // http://eslint.org/docs/rules/consistent-return
        'curly': [2, 'all'],             // http://eslint.org/docs/rules/curly
        'default-case': 2,               // http://eslint.org/docs/rules/default-case
        'dot-location': ['error', 'property'], // http://eslint.org/docs/rules/dot-location
        'dot-notation': [2, {            // http://eslint.org/docs/rules/dot-notation
          'allowKeywords': true
        }],
        'eqeqeq': 2,                     // http://eslint.org/docs/rules/eqeqeq
        'guard-for-in': 2,               // http://eslint.org/docs/rules/guard-for-in
        'no-caller': 2,                  // http://eslint.org/docs/rules/no-caller
        'no-div-regex': 2,               // http://eslint.org/docs/rules/no-div-regex
        'no-case-declarations': 2,       // http://eslint.org/docs/rules/no-case-declarations
        'no-else-return': 2,             // http://eslint.org/docs/rules/no-else-return
        'no-empty-function': 2,          // http://eslint.org/docs/rules/no-empty-function
        'no-eq-null': 2,                 // http://eslint.org/docs/rules/no-eq-null
        'no-eval': 2,                    // http://eslint.org/docs/rules/no-eval
        'no-extend-native': 2,           // http://eslint.org/docs/rules/no-extend-native
        'no-extra-bind': 2,              // http://eslint.org/docs/rules/no-extra-bind
        'no-fallthrough': 2,             // http://eslint.org/docs/rules/no-fallthrough
        'no-floating-decimal': 2,        // http://eslint.org/docs/rules/no-floating-decimal
        'no-implicit-coercion': 2,       // http://eslint.org/docs/rules/no-implicit-coercion
        'no-implied-eval': 2,            // http://eslint.org/docs/rules/no-implied-eval
        'no-labels': 2,                  // http://eslint.org/docs/rules/no-labels
        'no-lone-blocks': 2,             // http://eslint.org/docs/rules/no-lone-blocks
        'no-loop-func': 2,               // http://eslint.org/docs/rules/no-loop-func
        'no-multi-str': 2,               // http://eslint.org/docs/rules/no-multi-str
        'no-native-reassign': 2,         // http://eslint.org/docs/rules/no-native-reassign
        'no-new': 2,                     // http://eslint.org/docs/rules/no-new
        'no-new-func': 2,                // http://eslint.org/docs/rules/no-new-func
        'no-new-wrappers': 2,            // http://eslint.org/docs/rules/no-new-wrappers
        'no-octal': 2,                   // http://eslint.org/docs/rules/no-octal
        'no-octal-escape': 2,            // http://eslint.org/docs/rules/no-octal-escape
        'no-param-reassign': 2,          // http://eslint.org/docs/rules/no-param-reassign
        'no-redeclare': 2,               // http://eslint.org/docs/rules/no-redeclare
        'no-return-assign': 2,           // http://eslint.org/docs/rules/no-return-assign
        'no-self-assign': 2,             // http://eslint.org/docs/rules/no-self-assign
        'no-self-compare': 2,            // http://eslint.org/docs/rules/no-self-compare
        'no-sequences': 2,               // http://eslint.org/docs/rules/no-sequences
        'no-throw-literal': 2,           // http://eslint.org/docs/rules/no-throw-literal
        'no-unmodified-loop-condition': 2, // http://eslint.org/docs/rules/no-unmodified-loop-condition
        'radix': 2,                      // http://eslint.org/docs/rules/radix
        'wrap-iife': [2, 'any'],         // http://eslint.org/docs/rules/wrap-iife
        'yoda': 2,                       // http://eslint.org/docs/rules/yoda
        'no-process-exit': 2,            // http://eslint.org/docs/rules/no-process-exit
        'handle-callback-err': 1,        // http://eslint.org/docs/rules/handle-callback-err

        // Style

        'array-bracket-spacing': [2, 'always'], // http://eslint.org/docs/rules/array-bracket-spacing
        'block-spacing': ['error', 'always'],   // http://eslint.org/docs/rules/block-spacing
        'brace-style': [2,                      // http://eslint.org/docs/rules/brace-style
          '1tbs',
          {
            'allowSingleLine': false
          }
        ],
        'camelcase': [1, {                      // http://eslint.org/docs/rules/camelcase
          'properties': 'always'
        }],
        'comma-spacing': [2, {                  // http://eslint.org/docs/rules/comma-spacing
          'before': false,
          'after': true
        }],
        'comma-style': [2, 'last'],             // http://eslint.org/docs/rules/comma-style
        'consistent-this': ['error', 'self'],   // http://eslint.org/docs/rules/consistent-this
        'eol-last': 2,                          // http://eslint.org/docs/rules/eol-last
        'indent': [2, 2, { 'SwitchCase': 1 }],  // http://eslint.org/docs/rules/indent
        'key-spacing': [2, {             // http://eslint.org/docs/rules/key-spacing
          'beforeColon': false,
          'afterColon': true
        }],
        'keyword-spacing': 2,            // http://eslint.org/docs/rules/space-after-keywords
        'new-parens': 2,                 // http://eslint.org/docs/rules/new-parens
        'new-cap': [1, {                 // http://eslint.org/docs/rules/new-cap
          'newIsCap': true
        }],
        'newline-after-var': [2, 'always'], // http://eslint.org/docs/rules/newline-after-var
        'no-lonely-if': 1,               // http://eslint.org/docs/rules/no-lonely-if
        'no-mixed-spaces-and-tabs': 1,   // http://eslint.org/docs/rules/no-mixed-spaces-and-tabs
        'no-multiple-empty-lines': [2, { // http://eslint.org/docs/rules/no-multiple-empty-lines
          'max': 2
        }],
        'no-nested-ternary': 2,          // http://eslint.org/docs/rules/no-nested-ternary
        'no-new-object': 2,              // http://eslint.org/docs/rules/no-new-object
        'no-array-constructor': 2,       // http://eslint.org/docs/rules/no-array-constructor
        'no-spaced-func': 2,             // http://eslint.org/docs/rules/no-spaced-func
        'no-trailing-spaces': 2,         // http://eslint.org/docs/rules/no-trailing-spaces
        'no-unneeded-ternary': 1,        // http://eslint.org/docs/rules/no-unneeded-ternary
        'no-whitespace-before-property': 2,    // http://eslint.org/docs/rules/no-whitespace-before-property
        'object-curly-spacing': [2, 'always'], // http://eslint.org/docs/rules/object-curly-spacing
        'one-var': [2, 'never'],         // http://eslint.org/docs/rules/one-var
        'quotes': [                      // http://eslint.org/docs/rules/quotes
          2,
          'single',
          'avoid-escape'
        ],
        'semi': [2, 'always'],           // http://eslint.org/docs/rules/semi
        'semi-spacing': [2, {            // http://eslint.org/docs/rules/semi-spacing
          'before': false,
          'after': true
        }],
        'space-before-blocks': 2,        // http://eslint.org/docs/rules/space-before-blocks
        'space-before-function-paren': [2, 'never'], // http://eslint.org/docs/rules/space-before-function-paren
        'space-infix-ops': 2,            // http://eslint.org/docs/rules/space-infix-ops
        'space-unary-ops': 2,            // http://eslint.org/docs/rules/space-unary-ops
        'spaced-comment': [2, 'always',  {// http://eslint.org/docs/rules/spaced-comment
          'exceptions': ['-', '+'],
          'markers': ['=', '!']          // space here to support sprockets directives
        }],
    }
};