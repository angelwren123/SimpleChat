import { View, Text } from 'react-native'
import React, { useState,useEffect } from 'react'
import LoginComponent from '../../Components/LoginComponent/LoginComponent';
import RegisterComponent from '../../Components/RegisterComponent/RegisterComponent';


const LoginAndRegisterScreen = () => {
    const [isLoginScreen, setIsLoginScreen] = useState(true);
        if (isLoginScreen) {
            return <LoginComponent setIsLoginScreen={setIsLoginScreen} />
        } else {
            return <RegisterComponent setIsLoginScreen={setIsLoginScreen} />
        }
}

export default LoginAndRegisterScreen;