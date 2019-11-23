import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyCY9Ns_c3S2ND-UTHsjMTN0jhO8Ag0a22Y",
    authDomain: "buddy-67.firebaseapp.com",
    databaseURL: "https://buddy-67.firebaseio.com",
    projectId: "buddy-67",
    storageBucket: "buddy-67.appspot.com",
    messagingSenderId: "621312219494",
    appId: "1:621312219494:web:5bf53d73aa2cbd8f6790a7",
    measurementId: "G-8L65V0VGJW"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();
