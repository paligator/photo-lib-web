module.exports = {
	apps: [{
		name: 'photo-lib-web',
		script: 'serve -s build',
		args: '',
		instances: '2',
		autorestart: true,
		max_restarts: 5,
		watch: false,
		max_memory_restart: '500M',
		merge_logs: true,
		env: {
			NODE_ENV: 'development'
		},
		env_production: {
			NODE_ENV: 'production'
		}
	}],

	deploy: {
		production: {
			user: 'photolib',
			host: '192.168.1.11',
			key: '/c/Users/pavol.zelenka/.ssh/paligator.pem',
			ref: 'origin/testbuild',
			repo: 'git@github.com:paligator/photo-lib-web.git',
			path: '/home/photolib/photo-lib/photo-lib-web',
			'post-deploy': 'npm install && npm run build:prod && pm2 reload ecosystem.config.js --env production'
		}
	}
};
