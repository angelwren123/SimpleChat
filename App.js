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


// import React, { Component } from 'react';
// import { View } from 'react-native';
// import { LoginButton, AccessToken, Settings } from 'react-native-fbsdk-next';
// import SplashScreen from 'react-native-splash-screen';
// export default class Login extends Component {
//   componentDidMount() {
//     // do stuff while splash screen is shown
//       // After having done stuff (such as async tasks) hide the splash screen
//       Settings.setAppID('746489427139440');
//       SplashScreen.hide();
//   }
//   render() {
//     return (
//       <View>
//         <LoginButton
//           onLoginFinished={
//             (error, result) => {
//               if (error) {
//                 console.log("login has error: " + result.error);
//               } else if (result.isCancelled) {
//                 console.log("login is cancelled.");
//               } else {
//                 AccessToken.getCurrentAccessToken().then(
//                   (data) => {
//                     console.log(data.accessToken.toString())
//                   }
//                 )
//               }
//             }
//           }
//           onLogoutFinished={() => console.log("logout.")}/>
//       </View>
//     );
//   }
// };
