const cron = require('node-cron');
const logger = require('../config/logger');
const User = require('../api/user/user');


// Schedule a job to run every hour
cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();
        const result = await User.deleteMany({ expirationTime: { $lt: now } });
        logger.info(`Cleanup job: Deleted ${result.deletedCount} expired users`);
    } catch (err) {
        logger.error(`Cleanup job failed with error: ${err.message}`, err);
    }
});

module.exports = cron;