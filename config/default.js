var config = {
    env    : process.env.NODE_ENV || 'development',
    appHost: process.env.HOST || 'http://localhost',
    appPort: parseInt(process.env.PORT, 10) || 3031,
    dbHost : process.env.DB_HOST || 'localhost:27017',
    dbName : process.env.DB_NAME || 'cash_flow',

    dbConnectionOptions: {
        db: {
            native_parser: true
        },
        user: process.env.DB_USER || 'cash_flow_user',
        pass: process.env.DB_PASS || 'cash_flow_1234'
    }
};

if (config.env === 'test') {
    config.dbName = 'cash_flow_test';
}

module.exports = config;
