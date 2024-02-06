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




// interface AppConfig {
//   isGuestMode?: boolean; // Make it optional by adding '?'
//   // Other properties...
// }


// // Define a variable to hold the configuration
// let config: AppConfig;

// // Determine the environment and assign the appropriate configuration
// if (process.env.NODE_ENV === 'production') {
//   config = { ...configProd };
// } else {
//   config = { ...configDev };
// }

// // Modify the configuration as needed
// config.isGuestMode = true;

// export { config };
