import mongoose from 'mongoose';
import config from './config.js';
import logger from './logger.js';



/**
 * MongoConnection class to manage MongoDB connection using Mongoose.
 * It provides methods to connect, disconnect, and retrieve the current connection.
 * The connection is established using the URI and database name from the configuration.
 * It also handles connection events such as errors and disconnections.
 */

class MongoConnection {

    constructor(){
        this.connection = null;
    }


    /**
     * connects to the MongoDB database using Mongoose.
     * It checks if a connection already exists and returns it if so.
     * If not, it establishes a new connection using the URI and database name from the configuration.
     * It also sets up event listeners for connection errors and disconnections.
     * @returns {Promise<mongoose.Connection>}
     */
    async connect() {
        try {
            if(this.connection) {
                logger.info('MongoDB is already connected');
                return this.connection;
            }


            await mongoose.connect(config.mongo.uri, {
                dbName: config.mongo.dbName,
            });

            this.connection = mongoose.connection;

            logger.info(`MongoDB connected ${config.mongo.uri}`);

            this.connection.on('error', (err) => {
                logger.error('MongoDB connection error', { error: err });
            });

            this.connection.on('disconnected', () => {
                logger.error('MongoDB disconnected');
            });

            return this.connection;

        } catch (error) {
            logger.error('Error connecting to MongoDB', { error });
            throw error;
        }
    }


    /**
     * disconnects from the MongoDB database using Mongoose.
     * It checks if a connection exists and disconnects it if so.
     * It also logs the disconnection event and sets the connection to null.
     * @returns {Promise<void>}
     */
    async disconnect() {
        try {
            if(this.connection) {
                await mongoose.disconnect();
                logger.info('MongoDB disconnected');
                this.connection = null;
            }
        } catch (error) {
            logger.error('Error disconnecting from MongoDB', { error });
            throw error;
        }
    }
    
    
    /**
     * Retrieves the current MongoDB connection.
     * @returns {mongoose.Connection|null}
     */
    getConnection() {
        return this.connection;
    }

}


export default new MongoConnection();