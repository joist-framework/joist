module.exports = {
  files: ['*.html', 'target/**'],
  server: {
    baseDir: './',
    routes: {
      '/node_modules': '../../node_modules'
    }
  }
};
