/**
 * @format
 */
import {AppRegistry, Platform} from 'react-native';
// import PushNotification from "react-native-push-notification";

// Must be outside of any component LifeCycle (such as `componentDidMount`).
// PushNotification.configure({
//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister: function (token) {
//     console.log("token:", token);
    
//   },

//   // (required) Called when a remote is received or opened, or local notification is opened
//   onNotification: function (notification) {
//     console.log("ntf:", notification);
//     if(notification.action === "ReplyInput"){
//       console.log("texto", notification.reply_text)// this will contain the inline reply text. 
//     }
//     // process the notification

//     // (required) Called when a remote is received or opened, or local notification is opened
//     // notification.finish(PushNotificationIOS.FetchResult.NoData);
//   },

//   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//   onAction: function (notification) {
//     console.log("act:", notification.action);
//     console.log("ntfact:", notification);
//     if(notification.action === "ReplyInput"){
//       console.log("texto", notification.reply_text)// this will contain the inline reply text. 
//     }
//     // process the action
//   },

//   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//   onRegistrationError: function(err) {
//     console.error(err.message, err);
//   },

//   // IOS ONLY (optional): default: all - Permissions to register.
// //   permissions: {
// //     alert: true,
// //     badge: true,
// //     sound: true,
// //   },

//   // Should the initial notification be popped automatically
//   // default: true
//   popInitialNotification: true,

//   /**
//    * (optional) default: true
//    * - Specified if permissions (ios) and token (android and ios) will requested or not,
//    * - if not, you must call PushNotificationsHandler.requestPermissions() later
//    * - if you are not using remote notification or do not have Firebase installed, use this:
//    *     requestPermissions: Platform.OS === 'ios'
//    */
//   requestPermissions: Platform.OS === 'ios',
// });


// // ONESIGNAL
// import OneSignal from 'react-native-onesignal';

// const app_id_onesignal = '45dfaeb6-0e9b-4e60-9323-10a0337a4734'
// // OneSignal Initialization
// OneSignal.setAppId(app_id_onesignal);

// // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
// OneSignal.promptForPushNotificationsWithUserResponse();

// //Method for handling notifications received while app in foreground
// OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
//   console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
//   let notification = notificationReceivedEvent.getNotification();
//   console.log("notification: ", notification);
//   const data = notification.additionalData
//   console.log("additionalData: ", data);
//   // Complete with null means don't show a notification.
//   notificationReceivedEvent.complete(notification);
// });

// //Method for handling notifications opened
// OneSignal.setNotificationOpenedHandler(notification => {
//   console.log("OneSignal: notification opened:", notification);
// });
import App from './App';
import {name as appName} from './app.json';
import notifee, { EventType } from '@notifee/react-native';
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('onBackgroundEvent');
});
AppRegistry.registerComponent(appName, () => App);
