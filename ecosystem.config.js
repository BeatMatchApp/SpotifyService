module.exports = {
  apps: [
    {
      name: 'spotify_server_app',
      script: './dist/server.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
