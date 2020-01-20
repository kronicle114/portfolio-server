require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 8080,
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb+srv://admin:admin123@examplecluster-xydkv.mongodb.net/test',
    TEST_MONGODB_URI: process.env.TEST_MONGODB_URI || 'mongodb://localhost/portfolio-server-test', 
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
}