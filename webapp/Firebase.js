sap.ui.define([
	"sap/ui/model/json/JSONModel",
], function (JSONModel) {
	"use strict";

	// Firebase-config retrieved from the Firebase-console
	const firebaseConfig = {
		apiKey: "",
		authDomain: "",
		databaseURL: "",
		projectId: "",
		storageBucket: "",
		messagingSenderId: "",
		appId: ""
	};

	return {
		initializeFirebase: function () {
			// Initialize Firebase with the Firebase-config
			//firebase.initializeApp(firebaseConfig);
			if (!firebase.apps.length) {
				firebase.initializeApp(firebaseConfig);
			}

			// Create a Firestore reference
			const firestore = firebase.firestore();

			// Create a Authentication reference
			const fireAuth = firebase.auth();

			// Create a FCM reference
			const messaging = firebase.messaging();

			// Firebase services object
			const oFirebase = {
				firestore: firestore,
				fireAuth: fireAuth,
				fcm: messaging
			};

			// Create a Firebase model out of the oFirebase service object which contains all required Firebase services
			var fbModel = new JSONModel(oFirebase);

			// Return the Firebase Model
			return fbModel;
		}
	};
});