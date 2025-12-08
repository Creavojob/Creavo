module.exports = {
  apps: [
    {
      name: 'creavo-backend',
      script: 'src/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development',
        PORT: process.env.PORT || 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 5000
      }
    }
  ]
};
