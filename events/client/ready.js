const cronjob = require('cron').CronJob;
const fs = require('fs');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);

const path = require('path');

module.exports = {
    name: 'ready',
    once: true,
    async execute(message, client, Discord) {

        console.log('Client is online!');
        console.timeEnd('Time to online');

        
    }
};
