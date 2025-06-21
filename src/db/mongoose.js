const mongoose = require('mongoose');
const logger = require('../config/logger');

class MongoClient {
    async connect(){
        try{
            await mongoose.connect('mongodb://127.0.0.1:27017/instagram-clone-db', {});
            logger.info('Connected to MongoDB Successfully');
        }catch (err) {
            logger.error({ message: 'Database connection failed', error: err.message });
            process.exit(1);
        }
    }
}

const mongoClient = new MongoClient();
Object.freeze(mongoClient);
module.exports = mongoClient;