// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js');

const firebaseConfig = {
	apiKey: "",
	authDomain: "",
	databaseURL: "",
	projectId: "",
	storageBucket: "",
	messagingSenderId: "",
	appId: ""
};

//firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

//FCM Reference
const messaging = firebase.messaging();

// Enable background messaging handler
messaging.setBackgroundMessageHandler(function (payload) {
	console.log("Message received in background. ", payload);
	
	// Retrieve data from the notification
	var notification = JSON.parse(payload.data.notification);
	const notificationTitle = notification.title;
	const notificationOptions = {
		body: notification.body,
		icon: "/webapp/" + notification.icon
	};

	// Show the notification with the params
	return self.registration.showNotification(notificationTitle,
		notificationOptions);
});