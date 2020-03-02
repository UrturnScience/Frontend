import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDiQmGf0AsS_-UfICp6dYmSViZERTiQGZc",
    authDomain: "urturn-science.firebaseapp.com",
    databaseURL: "https://urturn-science.firebaseio.com",
    projectId: "urturn-science",
    storageBucket: "urturn-science.appspot.com",
   
  };
const Firebase = firebase.initializeApp(firebaseConfig);
export default Firebase;