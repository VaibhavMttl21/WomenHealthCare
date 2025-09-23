module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: 'npm run dev',
      cwd: './backend/api-gateway',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      autorestart: true,
      max_restarts: 3,
      min_uptime: '10s'
    },
    {
      name: 'auth-service',
      script: 'npm run dev',
      cwd: './backend/services/auth-service',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      watch: false,
      autorestart: true,
      max_restarts: 3,
      min_uptime: '10s'
    },
    {
      name: 'profile-service',
      script: 'npm run dev',
      cwd: './backend/services/profile-service',
      env: {
        NODE_ENV: 'development',
        PORT: 3002
      },
      watch: false,
      autorestart: true,
      max_restarts: 3,
      min_uptime: '10s'
    },
    {
      name: 'chat-service',
      script: 'npm run dev',
      cwd: './backend/services/chat-service',
      env: {
        NODE_ENV: 'development',
        PORT: 3003
      },
      watch: false,
      autorestart: true,
      max_restarts: 3,
      min_uptime: '10s'
    },
    {
      name: 'appointment-service',
      script: 'npm run dev',
      cwd: './backend/services/appointment-service',
      env: {
        NODE_ENV: 'development',
        PORT: 3004
      },
      watch: false,
      autorestart: true,
      max_restarts: 3,
      min_uptime: '10s'
    },
    {
      name: 'frontend',
      script: 'npm run dev',
      cwd: './frontend',
      env: {
        NODE_ENV: 'development'
      },
      watch: false,
      autorestart: true,
      max_restarts: 3,
      min_uptime: '10s'
    }
  ]
};
