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

Take this IP address and put it in a `.env` file at the project root: `BACKEND_URL=http://192.168.XX.XX:3000`
