module.exports = {
  presets: [['@babel/preset-typescript', { onlyRemoveTypeImports: true }]],
  env: {
    test: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    },
    production: {
      presets: [['@babel/preset-env', { targets: { node: '10' } }]],
    },
  },
};
