/* eslint-disable @typescript-eslint/camelcase */
const env = require('dotenv').config().parsed

module.exports = {
  apps: [
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
    {
      name: 'service-universe',
      script: 'npm start',
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
      script: 'npm start',
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
