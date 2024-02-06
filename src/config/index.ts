import dotenv from 'dotenv'
import configProd from './prod';
import configDev from './dev';

dotenv.config()

const MONGO_USERNAME = process.env.MONGO_USERNAME || ''
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ''
const MONGO_URL = process.env.NODE_ENV === 'production' ? configProd.dbURL : configDev.dbURL


const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3030

export const config = {
  mongo: {
    url: MONGO_URL
  },
  server: {
    port: SERVER_PORT
  }
}

