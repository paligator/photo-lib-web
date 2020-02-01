module.exports = {
	"env": {
		"browser": true,
		"node": true,
		"es6": true
	},
	"plugins": [
		"react-hooks"
	],
	"rules": {
		"no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": true }],
		"no-console": "off",
		"react/prop-types": "off",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn"
		// 'semi': [
		// 	'error',
		// 	'always'
		// ],
	},
	"settings": {
		"react": {
			"pragma": "React",
			"version": "16.0"
		},
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	/* beacause of class variable ie _isMounted = true, there was warning */
	"parser": "babel-eslint",
	/**********************************************************************/
	"parserOptions": {
		"sourceType": "module",
		"ecmaVersion": 9,
		"ecmaFeatures": {
			"jsx": true,
			"modules": true
		},
	}
}