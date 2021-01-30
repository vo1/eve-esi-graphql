/* eslint-disable @typescript-eslint/camelcase */
const env = require('dotenv').config().parsed

module.exports = {
  apps: [
    {
      name: 'service-character',
      script: 'node build/index.js',
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
    {
      name: 'service-corporation',
      script: 'node build/index.js',
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
    {
      name: 'service-universe',
      script: 'node build/index.js',
      cwd: './service-universe',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        ...env,
        PORT: 4003,
      },
    },
    {
      name: 'service-market',
      script: 'node build/index.js',
      cwd: './service-market',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        ...env,
        PORT: 4004,
      },
    },
	{
      name: 'service-sde',
      script: 'node build/index.js',
      cwd: './service-sde',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        ...env,
        PORT: 4004,
      },
    },
    {
      name: 'gateway',
      script: 'node build/index.js',
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
		APOLLO_INTROSPECTION: env.APOLLO_INTROSPECTION,
		APOLLO_PLAYGROUND: env.APOLLO_PLAYGROUND,
      },
    }
  ],
}
