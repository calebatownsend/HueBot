module.exports = {
  'extends': 'google',
  'env': {
    'node': true,
    'es2021': true,
  },
  'rules': {
    'max-len': ['error', {'code': 120, 'comments': 120, 'ignoreStrings': true, 'ignoreUrls': true}],
    'brace-style': [2, 'stroustrup', {'allowSingleLine': true}],
    'no-unused-vars': ['warn'],
    'require-jsdoc': ['warn'],
  },
};
