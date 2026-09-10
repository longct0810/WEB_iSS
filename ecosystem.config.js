const path = require('path');

const rootDirectory = __dirname;

module.exports = {
  apps: [
    {
      name: 'smartgrid',
      cwd: rootDirectory,
      script: path.join(rootDirectory, 'index.js'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      min_uptime: '15s',
      max_restarts: 20,
      restart_delay: 3000,
      exp_backoff_restart_delay: 100,
      max_memory_restart: '700M',
      kill_timeout: 15000,
      listen_timeout: 15000,
      time: true,
      merge_logs: true,
      out_file: path.join(rootDirectory, 'logs', 'smartgrid-out.log'),
      error_file: path.join(rootDirectory, 'logs', 'smartgrid-error.log'),
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
