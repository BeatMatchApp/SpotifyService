module.exports = {
  apps: [
    {
      name: 'spotify_server_app',
      script: './dist/server.js',
      cwd: './',
      env: {
        NODE_ENV: 'development',
        PORT: 4001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4001,
      },
    },
  ],
};
