module.exports = {
	"env": {
		"browser": true,
		"node": true,
		"es6": true
	},
	"rules": {
		"no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": true }],
		"no-console": "off",
		"react/prop-types": "off"

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
		}
	}
}