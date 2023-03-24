import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect} from 'react'
import MainStackNavigator from './src/Routes/MainStackNavigator'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import store from './src/Redux/store';
import { persistor } from './src/Redux/store';
import { NavigationContainer } from '@react-navigation/native';

import  LoadingSpinner, {loaderRef}  from './src/Components/LoadingSpinner/LoadingSpinner';
const App = () => {
  
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <NavigationContainer>
          <MainStackNavigator />
          <LoadingSpinner ref={loaderRef} />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}

export default App
const styles = StyleSheet.create({})



// // import React, {useEffect} from 'react';
// // import {View, Button, Alert} from 'react-native';
// // import notifee from '@notifee/react-native';
// // import messaging from '@react-native-firebase/messaging';
// // import NotificationService from './NotificationService';

// // function App() {
// //   useEffect(() => {
// //     getFCMToken();
// //     requestPermission();
// //     const unsubscribe = messaging().onMessage(async remoteMessage => {
// //       console.log('remoteMessage', JSON.stringify(remoteMessage));
// //       DisplayNotification(remoteMessage);
// //       // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
// //     });
// //     return unsubscribe;
// //   }, []);

// //   const getFCMToken = () => {
// //     messaging()
// //       .getToken()
// //       .then(token => {
// //         console.log('token=>>>', token);
// //       });
// //   };

// //   const requestPermission = async () => {
// //     const authStatus = await messaging().requestPermission();
// //   };

// //   async function DisplayNotification(remoteMessage) {
// //     // Create a channel
// //     const channelId = await notifee.createChannel({
// //       id: 'default',
// //       name: 'Default Channel',
// //     });

// //     // Display a notification
// //     await notifee.displayNotification({
// //       title: remoteMessage.notification.title,
// //       body: remoteMessage.notification.body,
// //       android: {
// //         channelId,
// //         smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
// //       },
// //     });
// //   }

// //   async function localDisplayNotification() {
// //     // Create a channel
// //     const channelId = await notifee.createChannel({
// //       id: 'default',
// //       name: 'Default Channel',
// //     });

// //     // Display a notification
// //     notifee.displayNotification({
// //       title:
// //         '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
// //       subtitle: '&#129395;',
// //       body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
// //       android: {
// //         channelId,
// //         color: '#4caf50',
// //         actions: [
// //           {
// //             title: '<b>Dance</b> &#128111;',
// //             pressAction: {id: 'dance'},
// //           },
// //           {
// //             title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
// //             pressAction: {id: 'cry'},
// //           },
// //         ],
// //       },
// //     });
// //   }

// //   const sendNotification = async () => {
// //     let notificationData = {
// //       title: 'First Notification',
// //       body: 'Notification Body',
// //       token:
// //         'cCBdYjsgRZGyUj8V3oqzQp:APA91bH3NQoAekhLzw4IBCy_vwYbnJMUZaYC46cSUr4gdqCLo2EbQVy94gtyY0yZNClZSZjAlN1TxkrlPIJQXk9hgKm5k6TMv6JPH5u8P0jrJf_cQ2i_eZbf1hpgjmFg4TgibXw-nRnr',
// //     };
// //     await NotificationService.sendSingleDeviceNotification(notificationData);
// //   };

// //   const sendMultiNotification = async () => {
// //     let notificationData = {
// //       title: 'First Multi Device Notification',
// //       body: 'Notification Body',
// //       token: [
// //         'cCBdYjsgRZGyUj8V3oqzQp:APA91bH3NQoAekhLzw4IBCy_vwYbnJMUZaYC46cSUr4gdqCLo2EbQVy94gtyY0yZNClZSZjAlN1TxkrlPIJQXk9hgKm5k6TMv6JPH5u8P0jrJf_cQ2i_eZbf1hpgjmFg4TgibXw-nRnr',
// //       ],
// //     };
// //     await NotificationService.sendMultiDeviceNotification(notificationData);
// //   };

// //   return (
// //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
// //       <Button title="Send Notification" onPress={sendNotification} />
// //       <Button
// //         title="Send Multi Device Notification"
// //         onPress={sendMultiNotification}
// //       />
// //     </View>
// //   );
// // }

// // export default App;



// import React from "react";
// import { Text, TouchableOpacity } from "react-native";
// import Spinner from 'react-native-loading-spinner-overlay';
// function useChange() {
//   const [state, setState] = React.useState(0);
//   function change(value) {
//     setState(value);
//   }

//   return { change, state };
// }
// export const useChangeLoader = () => {
//   const [state, setState] = React.useState(false);
//   function showLoader() {
//     setState(true);
//   }
//   function hideLoader() {
//     setState(false);
//   }
//   return [state, showLoader, hideLoader];
// }


// export default App = () => {
//   const [state,showLoader] = useChangeLoader();
//   return (
//     <>
//       <TouchableOpacity
//         onPress={() => {
//           // Update state value on press
//           showLoader()
//         }}
//       >
//         <Text>Click Me!{state}</Text>
//       </TouchableOpacity>
//       <Spinner visible={state} />

//     </>
//   );
// }
