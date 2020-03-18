import * as firebase from 'firebase';

export const firebaseConfig = {
  apiKey: "AIzaSyDuZC06-cZnHm2vnoxL9j7pS12fknkH_c0",
  authDomain: "urturnscience-65095.firebaseapp.com",
  databaseURL: "https://urturnscience-65095.firebaseio.com",
  projectId: "urturnscience-65095",
  storageBucket: "urturnscience-65095.appspot.com",
  appId: "1:4447972043:web:99fce69cee6511eb3dc94e",   
};

const Firebase = firebase.initializeApp(firebaseConfig);

export default Firebase;