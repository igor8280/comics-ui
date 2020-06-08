module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
		'@vue/standard'
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		// allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// use tab
		'indent': ['warn', 'tab', {'SwitchCase': 1}],
		// no need for space
		'space-before-function-paren': ['error', 'never'],
		// Allow constructor calls using the new keyword without storing to a variable.
		'no-new': 0,
		// semicolons required
		'semi': ['error', 'always'],
		'curly': ['error', 'multi-or-nest'],
		'brace-style': ['error', 'stroustrup'],
		'no-multiple-empty-lines': [2, {'max': 2, 'maxEOF': 2}],
		'no-tabs': 0,
		'object-curly-spacing': ['error', 'never']
	},
	parserOptions: {
		parser: 'babel-eslint'
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)'
			],
			env: {
				jest: true
			}
		}
	]
};
