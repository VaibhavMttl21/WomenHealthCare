const path = require('path');

module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: 'npm run dev',
      cwd: path.resolve(__dirname, 'backend/api-gateway'),
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'auth-service',
      script: 'npm run dev',
      cwd: path.resolve(__dirname, 'backend/services/auth-service'),
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'chatbot-service',
      script: 'npm run dev',
      cwd: './backend/services/chatbot-service',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'frontend',
      script: 'npm run dev',
      cwd: path.resolve(__dirname, 'frontend'),
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'notification-service',
      script: 'npm run dev',
      cwd: './backend/services/notification-service',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'appointment-service',
      script: 'npm run dev',
      cwd:  './backend/services/appointment-service',
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};