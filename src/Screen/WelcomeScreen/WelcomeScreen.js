import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { Colors } from '../../assets/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
const WelcomeScreen = () => {
    const navigate = useNavigation();
    const dispatch = useDispatch();
    const _CheckIsLogin = async () => {
        const value = await AsyncStorage.getItem('isUserLogged');
        const parseValue = JSON.parse(value);
        if (parseValue === "false") {
            navigate.navigate('LoginAndRegisterScreen');
        } else {
            navigate.navigate('MainScreen');
        }

    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', padding: 30 }}>
            {/* <View>
                <Text style={{ fontSize: 50, color: Colors.black }}>CHÀO MỪNG</Text>
            </View> */}
            <TouchableOpacity
                onPress={() => _CheckIsLogin()}
                style={{ backgroundColor: Colors.white, borderWidth: 0.5, borderColor: Colors.black, padding: 30, marginVertical: 20, borderRadius: 50 }}
            >
                <AntDesign name='right' size={30} color={Colors.black} />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default WelcomeScreen