/* eslint-disable @typescript-eslint/camelcase */
const path = require('path')
const env = require('dotenv').config().parsed

module.exports = {
  apps: [
    // Gateway
	{
      name: 'build-gateway',
      script: 'yarn build',
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
      script: 'rm -rf dist && mkdir dist && yarn start',
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
    },
	// Character ESI
    {
      name: 'build-service-character',
      script: 'yarn build',
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
      script: 'rm -rf dist && mkdir dist && yarn start',
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
      script: 'yarn build',
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
      script: 'rm -rf dist && mkdir dist && yarn start',
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
  ],
}
