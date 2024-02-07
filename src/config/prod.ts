export default {
  dbURL: process.env.MONGO_URL || 'mongodb+srv://.mongodb.net/moots_db',
  dbName: process.env.DB_NAME || 'moots_db',
}
