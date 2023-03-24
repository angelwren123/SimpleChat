import { View, Text, Image, Platform, AppState, Appearance } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { images } from '../assets/images';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginAndRegisterScreen,
  WelcomeScreen,
  HomeScreen,
  MyProfileScreen,
  ProfileScreen,
  ChatScreen,
  AddFriendScreen,
  ProfileUserScreen,
  RecommendFriendsScreen,
  RequestFriendScreen
} from '../Screen';
import { Colors } from '../assets/Colors';
import CusTomBottomTabBar from './CustomBottomTabBar';
import { useDispatch, useSelector } from 'react-redux';
import { actSaveInfoUser } from '../Redux/Actions/AuthAction'
import { getUsersRecommend } from '../Redux/Actions/UsersRecommendAction';
import { resetListFriend } from '../Redux/Actions/ListFriendAction'
import { requestUserPermission, NotificationListner } from '../utils/pushnotification_helper'
import messaging from '@react-native-firebase/messaging'
import PushNotification, { Importance } from 'react-native-push-notification';
import notifee, { EventType } from '@notifee/react-native';
import SplashScreen from 'react-native-splash-screen'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Stack2 = createNativeStackNavigator()
const config = {
  headerShown: false,
  presentation: 'modal',
  animationTypeForReplace: 'push',
  animation: 'slide_from_right',
  gestureDirection: 'horizontal',
  gestureEnabled: true,
  fullScreenGestureEnabled: true
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ lazy: false, tabBarHideOnKeyboard: true, }}
      initialRouteName='HomeScreen'
      tabBar={props => <CusTomBottomTabBar {...props} />}
      backBehavior='none'


    >
      <Tab.Screen
        name='HomeScreen'
        component={HomeScreen}
        options={{
          lazy: true,
          headerShown: false,
          tabBarIcon: images.icons.ic_comments,
          tabBarLabel: '',
          shifting: true,
          // ...config

        }}
      />
      <Tab.Screen
        name='RecommendFriendsScreen'
        component={RecommendFriendsScreen}
        options={{
          lazy: true,
          headerShown: false,
          tabBarIcon: images.icons.ic_users,
          tabBarLabel: '',
          shifting: true,
          // ...config
        }}

      />
      <Tab.Screen
        name='AddFriendScreen'
        component={AddFriendScreen}
        options={{
          lazy: true,
          headerShown: false,
          tabBarIcon: images.icons.ic_search,
          tabBarLabel: '',
          shifting: true,
          // ...config
        }}

      />
      <Tab.Screen
        name='ProfileScreen'
        component={ProfileScreen}
        options={{
          lazy: true,
          headerShown: false,
          tabBarIcon: images.icons.ic_settings,
          tabBarLabel: '',
          shifting: true,
          // ...config
        }}
      />

    </Tab.Navigator>
  )
}


const MainStackNavigator = () => {
  const dispatch = useDispatch();
  const [usersRecommend, setUsersRecommend] = useState([]);
  const { user } = useSelector(state => state.AuthReducer)
  const navigate = useNavigation();
  const appState = useRef(AppState.currentState);
  const userid = auth()?.currentUser?.uid
  useEffect(()=>{
    SplashScreen.hide();
  },[])
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // if (
      //   appState.current.match(/inactive|background/) &&
      //   nextAppState === 'active'
      // ) {
      //   console.log('App has come to the foreground!');
      // }
      console.log(nextAppState);
      if (nextAppState === 'background'|| nextAppState === 'unknown') {
        (async () => {
          try {
            // await messaging().deleteToken();
            await firestore().collection('users')?.doc(userid).update({
              status: firestore.FieldValue.serverTimestamp(),
              // token: "",
            });
            // await auth().signOut();
          } catch (error) {
            console.log(error)
          }
        })();
      }else{
        (async () => {
          try {
            // await messaging().deleteToken();
            await firestore().collection('users')?.doc(userid).update({
              status: "online",
              // token: "",
            });
            // await auth().signOut();
          } catch (error) {
            console.log(error)
          }
        })();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle user state changes
  useEffect(() => {
    Appearance.addChangeListener();
  }, []);

  useEffect(() => {
    const allUser = firestore().collection('users').onSnapshot((users) => {
      const list = [];
      users.forEach((user) => {
        if (user.data().displayName !== null) {
          list.push(user.data());
        }
      });
      if (list.length > 0) {
        let intersection = list?.filter(x => !user?.friends.includes(x.uid));
        const newData = intersection?.filter((item) => {
          return item.uid !== user?.uid
        })
        dispatch(getUsersRecommend(newData))
      }
    });
    return () => allUser();
  }, [user]);

  async function onAuthStateChanged(user) {
    if (user !== null) {
      
      requestUserPermission();
      
      await AsyncStorage.setItem('isUserLogged', JSON.stringify(`${true}`));
      const userLogged = await firestore().collection('users').doc(user.uid).get();
      
      dispatch(actSaveInfoUser(userLogged.data()));
      await firestore().collection('users').doc(user?.uid).update({
        status: 'online'
      });
    } else {
      dispatch(actSaveInfoUser(null));
      dispatch(resetListFriend());
      await AsyncStorage.setItem('isUserLogged', JSON.stringify(`${false}`));

    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber; // unsubscribe on unmount
  }, []);


  const createChannel = (channelId) => {
    PushNotification.createChannel(
      {
        channelId: channelId, // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  const showNotification = async (channelId, Options) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: channelId, // (required) channelId, if the channel doesn't exist, notification will not trigger.
      ticker: "My Notification Ticker", // (optional)
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
      largeIconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png", // (optional) default: undefined
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      bigText: "My big text that will be shown when notification is expanded. Styling can be done using HTML tags(see android docs for details)", // (optional) default: "message" prop
      subText: Options.subText, // (optional) default: none
      bigPictureUrl: Options.bigImage, // (optional) default: undefined
      bigLargeIcon: "ic_launcher", // (optional) default: undefined
      bigLargeIconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png", // (optional) default: undefined
      color: Options.color, // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      priority: "high", // (optional) set notification priority, default: high
      actions: ["ReplyInput"],
      reply_placeholder_text: "Write your response...", // (required)
      reply_button_text: "Reply", // (required)

      /* iOS and Android properties */
      title: Options.title, // (optional)
      message: Options.message, // (required)
    });
  }

  // useEffect(() => {
  // requestUserPermission();
  // NotificationListner();
  // const unsub = messaging().onMessage(async remoteMessage => {
  // const channelId = Math.random().toString(36).substring(7);
  // createChannel(channelId);
  // showNotification(channelId, {
  //   bigImage: remoteMessage.notification.android.imageUrl,
  //   title: remoteMessage.notification.title,
  //   message: remoteMessage.notification.body,
  //   subTitle: remoteMessage.data.subTitle,
  // });
  //   return console.log('notification on froground state.....', remoteMessage);
  // });
  // return () => unsub()
  // }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      DisplayNotification(remoteMessage);
      // return notifee.onForegroundEvent(({ type, detail }) => {
      //   switch (type) {
      //     case EventType.DISMISSED:
      //       console.log('User dismissed notification', detail.notification);
      //       break;
      //     case EventType.PRESS:
      //       console.log('User pressed notification', detail);
      //       navigate.navigate('ChatScreen', {
      //         displayName: remoteMessage.data?.displayName,
      //         photoURL: remoteMessage.data?.photoURL,
      //         uid: remoteMessage.data?.uid,
      //         token: remoteMessage.data?.token
      //       })
      //       break;
      //   }
      // });
    });
    return unsubscribe;
  }, []);

  async function DisplayNotification(remoteMessage) {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      },
      pressAction: {
        id: 'default',
      },

    });
  }

  return (
    <Stack.Navigator
      initialRouteName='WelcomeScreen' screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}

        options={{ ...config, }}

      />
      <Stack.Screen
        name="LoginAndRegisterScreen"
        component={LoginAndRegisterScreen}
        options={{ ...config, }}
      />


      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ ...config }}
      />
      <Stack.Screen
        name="ProfileUserScreen"
        component={ProfileUserScreen}
        options={{ ...config }}

      />
      <Stack.Screen
        name="MyProfileScreen"
        component={MyProfileScreen}
        options={{ ...config }}
      />
      <Stack.Screen
        name="RequestFriendScreen"
        component={RequestFriendScreen}
        options={{ ...config }}
      />
      <Stack.Screen
        name="MainScreen"
        component={BottomTabNavigator}
        options={{ ...config }}
        initialParams={'HomeScreen'}
      />

    </Stack.Navigator>

  )
}

export default MainStackNavigator