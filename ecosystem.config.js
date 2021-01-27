/* eslint-disable @typescript-eslint/camelcase */
const env = require('dotenv').config().parsed

module.exports = {
  apps: [
	// Character ESI
    {
      name: 'build-service-character',
      script: 'npm build',
      cwd: './service-character',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: env.NODE_ENV,
      },
    },
    {
      name: 'service-character',
      script: 'npm start',
      cwd: './service-character',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        ...env,
        PORT: 4001,
      },
    },
	// Corporation ESI
	{
      name: 'build-service-corporation',
      script: 'npm build',
      cwd: './service-corporation',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: env.NODE_ENV,
      },
    },
    {
      name: 'service-corporation',
      script: 'npm start',
      cwd: './service-corporation',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        ...env,
        PORT: 4002,
      },
    },

    // Gateway
	{
      name: 'build-gateway',
      script: 'npm build',
      cwd: './gw',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: env.NODE_ENV,
      },
    },
    {
      name: 'gateway',
      script: 'npm start',
      cwd: './gw',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        ...env,
        PORT: 4000,
        NODE_ENV: env.NODE_ENV,
		APOLLO_INTROSPECTION: true,
		APOLLO_PLAYGROUND: true,
      },
    }
  ],
}
