module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
        node: true,
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/all",
        "plugin:prettier/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
    ],
    globals: {
        browser: false,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 6,
        sourceType: "module",
    },
    rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": [
            1,
            { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "arrow-body-style": [2, "as-needed"],
        "class-methods-use-this": 0,
        "jest/no-hooks": 0,
        "jest/prefer-expect-assertions": 0,
        "no-console": 1,
        "no-param-reassign": ["error", { props: false }],
        "no-trailing-spaces": 2,
        "no-unused-vars": "off",
        "no-use-before-define": "off",
        "object-curly-newline": [
            2,
            {
                consistent: true,
                multiline: true,
            },
        ],
        "object-property-newline": [
            2,
            {
                allowAllPropertiesOnSameLine: true,
            },
        ],
        "prettier/prettier": [
            2,
            {
                bracketSpacing: true,
                semi: true,
                singleQuote: false,
                tabWidth: 4,
                trailingComma: "all",
            },
        ],
        "react/jsx-first-prop-new-line": [2, "multiline"],
        "react/jsx-indent": [2, 4],
        "react/jsx-indent-props": [2, 4],
        "react/prop-types": [2, { ignore: ["children"] }],
        "sort-imports": [
            2,
            {
                ignoreDeclarationSort: true,
            },
        ],
        "sort-keys": "warn",
    },
    settings: {
        "import/resolver": {
            node: {
                paths: ["src"],
            },
        },
        react: {
            version: "detect",
        },
    },
};
