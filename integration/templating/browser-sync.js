module.exports = {
  files: ['*.html'],
  server: {
    baseDir: './',
    routes: {
      '/node_modules': '../../node_modules'
    }
  }
};
