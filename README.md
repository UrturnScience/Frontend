# Frontend

Firebase Auth/Console Credentials:
Username/Email: urturnscience@gmail.com
Password: Shell482!

Facebook and Google:
Using that google account create a new project for firebase auth

For facebook, change the credentials in code to a new facebook account.

-rolland 03/08/20

## Linking to the backend

For linking Firebase for both the frontend and the backend, they have to have to access the same Firebase application. To do this, they both need a `firebase.json` file that points to the correct firebase project. When running locally, the dev should use the exact same `firebase.json` file for both the frontend and the backend.

Additionally, in order for expo to work, it needs the IP address of your computer on your network, specifically your NAT address.
- On a mac, this can be found by running `ifconfig | grep 192`. Your NAT IP address is the one listed next to `inet`.
- On windows, you have to use `ipconfig` and look for the address on your "wireless Lan adapter wifi".

Take this IP address and put it in a `.env` file at the project root.

## New `.env` structure

For the `.env` file to work with production, we needed to put all prod and dev firebase information + backend url information for prod and dev into the `.env` file. Sample .env file:

```
PRODUCTION_MODE=false

DEV_BACKEND_URL=http://192.168.XX.XX:3000
DEV_API_KEY=XXXXX
DEV_AUTH_DOMAIN=XXXXX.firebaseapp.com
DEV_DATABASE_URL=https://XXXXX.firebaseio.com
DEV_PROJECT_ID=XXXXX
DEV_STORAGE_BUCKET=XXXXX.appspot.com
DEV_MESSAGING_SENDER_ID=XXXXX
DEV_APP_ID=XXXXX

PROD_BACKEND_URL=http://example.backend.com
PROD_API_KEY=XXXXX
PROD_AUTH_DOMAIN=XXXXX.firebaseapp.com
PROD_DATABASE_URL=https://XXXXX.firebaseio.com
PROD_PROJECT_ID=XXXXX
PROD_STORAGE_BUCKET=XXXXX.appspot.com
PROD_MESSAGING_SENDER_ID=XXXXX
PROD_APP_ID=XXXXX
```