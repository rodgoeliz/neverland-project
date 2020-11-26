import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCkDwb0OKQ0TCYGAA2Iw05hatyw_N7YRO0",
    authDomain: "neverland-282203.firebaseapp.com",
    databaseURL: "https://neverland-282203.firebaseio.com",
};
firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();