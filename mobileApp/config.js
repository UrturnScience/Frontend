import { 
    PRODUCTION_MODE,
    DEV_BACKEND_URL,
    DEV_API_KEY,
    DEV_AUTH_DOMAIN,
    DEV_DATABASE_URL,
    DEV_PROJECT_ID,
    DEV_STORAGE_BUCKET,
    DEV_MESSAGING_SENDER_ID,
    DEV_APP_ID,
    PROD_BACKEND_URL,
    PROD_API_KEY,
    PROD_AUTH_DOMAIN,
    PROD_DATABASE_URL,
    PROD_PROJECT_ID,
    PROD_STORAGE_BUCKET,
    PROD_MESSAGING_SENDER_ID,
    PROD_APP_ID,
} from 'react-native-dotenv';

const inProd = PRODUCTION_MODE == "true" ? true : false;
let apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId;

if (inProd) {
    apiKey = PROD_API_KEY;
    authDomain = PROD_AUTH_DOMAIN;
    databaseURL = PROD_DATABASE_URL;
    projectId = PROD_PROJECT_ID;
    storageBucket = PROD_STORAGE_BUCKET;
    messagingSenderId = PROD_MESSAGING_SENDER_ID;
    appId = PROD_APP_ID;
} else {
    apiKey = DEV_API_KEY;
    authDomain = DEV_AUTH_DOMAIN;
    databaseURL = DEV_DATABASE_URL;
    projectId = DEV_PROJECT_ID;
    storageBucket = DEV_STORAGE_BUCKET;
    messagingSenderId = DEV_MESSAGING_SENDER_ID;
    appId = DEV_APP_ID;
}

const firebaseConfig = {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId
};

const BACKEND_URL = PRODUCTION_MODE == "true" ? PROD_BACKEND_URL : DEV_BACKEND_URL;
export { firebaseConfig, BACKEND_URL };
