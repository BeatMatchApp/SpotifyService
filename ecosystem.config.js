module.exports = {
  apps: [
    {
      name: 'spotify_server_app',
      script: './dist/app.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
