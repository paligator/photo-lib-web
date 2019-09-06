module.exports = {
	apps: [{
		name: 'photo-lib-web',
		script: 'serve -s -p 6500 build',
		args: '',
		instances: '1',
		autorestart: true,
		max_restarts: 5,
		watch: false,
		max_memory_restart: '900M',
		merge_logs: true,
		env: {
			REACT_APP_ENV: 'development'
		},
		env_production: {
			REACT_APP_ENV: 'production'
		}
	}],

	deploy: {
		production: {
			user: 'photolib',
			host: '192.168.1.11',
			key: '/c/Users/pavol.zelenka/.ssh/paligator.pem',
			ref: 'origin/master',
			repo: 'git@github.com:paligator/photo-lib-web.git',
			path: '/home/photolib/photo-lib/photo-lib-web',
			'post-deploy': 'npm install && npm run build:prod && pm2 reload ecosystem.config.js --env production'
		}
	}
};
