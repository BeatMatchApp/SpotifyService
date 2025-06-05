module.exports = {
  apps: [
    {
      name: 'spotify_server_app',
      script: './dist/server.js', // ✅ compiled JS file
      cwd: './', // ✅ makes sure paths resolve from your project root
      env: {
        NODE_ENV: 'development',
        PORT: 4001, // optional: for dev
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4001, // ✅ define PORT explicitly if not in .env
      },
    },
  ],
};
