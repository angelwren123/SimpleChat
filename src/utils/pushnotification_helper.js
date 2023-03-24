import messaging from '@react-native-firebase/messaging';
import AsyncStorage from "@react-native-async-storage/async-storage"
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
const GetFCMToken = async () => {
        try {
            await messaging().registerDeviceForRemoteMessages();
            const fcmtoken = await messaging().getToken();
            if (fcmtoken) {
                console.log("new token: ", fcmtoken);
                // await AsyncStorage.setItem('fcmtoken', fcmtoken);
                const useruid = auth().currentUser.uid;
                await firestore().collection('users').doc(useruid).update({
                    token: fcmtoken
                });

            }
        } catch (error) {
            console.log(error + 'err in fcmToken');
        }
}
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        // console.log('Authorization status:', authStatus);
        GetFCMToken();
    }
}



export const NotificationListner = () => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging()
    .onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });
    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        });

    // messaging()
    // .onMessageSent(async remoteMessage => {
    //     return console.log('notification on froground state.....', remoteMessage);
    // });
    messaging()
    .setBackgroundMessageHandler(async remoteMessage => {
        return console.log('Message handled in the background!', remoteMessage);
    });

}