import pg from 'pg';
import config from './index.js';
import logger from './logger.js';

const { Pool } = pg;



/**
 * PostgresConnection class manages the PostgreSQL connection pool and provides methods to interact with the database.
 * It ensures that only one instance of the connection pool is created and reused throughout the application.
 */

class PostgresConnection {
    constructor() {
        this.pool = null;
    }
    
    
    getPool() {
        if (!this.pool) {
            this.pool = new Pool({
                host: config.postgres.host,
                port: config.postgres.port,
                database: config.postgres.database,
                user: config.postgres.user,
                password: config.postgres.password,
                max: 20, // maximum number of clients in the pool
                idleTimeoutMillis: 30000, // close idle clients after 30 seconds
                connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
            });

            this.pool.on('error', (err) => {
                logger.error('Unexpected error on idle PostgreSQL client', { error: err });
    
            });

            logger.info('PostgreSQL connection pool created')

        }
        
        return this.pool;
    }    


    /**
     * Tests the PostgreSQL connection by executing a simple query.
     * Logs the result or any errors encountered during the test.
     * @returns {Promise<void>}
     * @throws Will throw an error if the connection test fails.
     */
    async testConnection() {
        try {
            const pool = this.getPool();
            const client = await pool.connect();
            const result = await client.query('SELECT NOW()');
            client.release();

            logger.info('PostgreSQL connection test successful', { time: result.rows[0].now });
        } catch (error) {
            logger.error('Error testing PostgreSQL connection', { error });
            throw error;
        }
    }


    /**
     * Executes a PostgreSQL query with the given text and parameters.
     * Logs the query execution details or any errors encountered.
     * @param {string} text - The SQL query text.
     * @param {Array} params - The parameters for the SQL query.
     * @returns {Promise<Object>} - A promise resolving to the query result.
     * @throws Will throw an error if the query execution fails.
     */
    async query(text, params) {
        const pool = this.getPool();
        const start = Date.now();

        try {
            const result = await pool.query(text, params);
            const duration = Date.now() - start;
            logger.info('PostgreSQL query executed', { text, duration, rows: result.rowCount }); 
            return result;
        } catch (error) {
            logger.error('Error executing PostgreSQL query', { text, error });
            throw error;
        }
    } 

   
    /**
     * Closes the PostgreSQL connection pool if it exists.
     * Logs the closure of the connection pool.
     * @returns {Promise<void>}
     */
    async close() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            logger.info('PostgreSQL connection pool closed');
        }
    
    } 
}    


export default new PostgresConnection();