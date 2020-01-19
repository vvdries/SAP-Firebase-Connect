sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/firebase/SAP-Firebase-Connect/model/models",
	"./Firebase"
], function (UIComponent, Device, models, Firebase) {
	"use strict";

	return UIComponent.extend("sap.firebase.SAP-Firebase-Connect.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// Import Firebase in the sap.ui.define
			// set the firebase model by calling the initializeFirebase function in the Firebase.js file
			this.setModel(Firebase.initializeFirebase(), "firebase");

			// AUTHENTICATION
			// Create a Fireauth reference
			const fireAuth = this.getModel("firebase").getProperty("/fireAuth");

			// Login the user anonymously
			fireAuth.signInAnonymously().catch(function (error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
			});

			// If the signInAnonymously method completes without error, the observer registered in the onAuthStateChanged 
			// will trigger and you can get the anonymous user's account data from the User object:
			fireAuth.onAuthStateChanged(function (user) {
				if (user) {
					// Example of accessible properties 
					var isAnonymous = user.isAnonymous;
					var uid = user.uid;
					//console.log("User: ", user);

					// CLOUD MESSAGING FCM
					// Since we are logged in now we will ask the user permission to send notifications
					// Create a FCM reference
					const messaging = this.getModel("firebase").getProperty("/fcm");

					//FCM ask permission
					messaging.requestPermission().then(function () {
						console.log("Have permission");
						return messaging.getToken();
					}).then(function (token) {
						console.log(token);
					}).catch(function (err) {
						console.log("Error occured");
					});

					// Show message in foreground (if desired)
					messaging.onMessage(function (payload) {
						console.log("Message received. ", payload);
						var notification = JSON.parse(payload.data.notification);
						const notificationTitle =notification.title;
						const notificationOptions = {
							body: notification.body,
							// icon: notification.icon,
							icon: sap.ui.require.toUrl("sap/firebase/SAP-Firebase-Connect/" + notification.icon)
						};
						var notification = new Notification(notificationTitle, notificationOptions);
						return notification;
					});
				} else {
					// User is signed out.
				}
			}.bind(this));
		}
	});
});