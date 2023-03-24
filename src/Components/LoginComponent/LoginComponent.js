import auth from '@react-native-firebase/auth';
import { Keyboard, SafeAreaView, StyleSheet,ToastAndroid, Text, View, TextInput, Dimensions, Pressable, TouchableOpacity, } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../assets/Colors';
import Toast from 'react-native-easy-toast';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../LoadingSpinner/LoadingSpinner';
const { width, height } = Dimensions.get('screen');
const LoginComponent = (props) => {
    const { setIsLoginScreen } = props;
    const navigate = useNavigation();
    const [error, setError] = useState('');
    const toast = useRef(null);
    const dispatch = useDispatch()
    const [valueInput, setValueInput] = useState({
        email: '',
        password: '',
    });
    const _login = async () => {
        if (valueInput.email === '' || valueInput.password === '') {
            ToastAndroid.show('Please enter information!', ToastAndroid.SHORT)
        } else {
            showLoader();
            await auth().signInWithEmailAndPassword(valueInput.email, valueInput.password)
                .then(async (res) => {
                    ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT)
                     navigate.navigate('MainScreen');    
                })
                .catch((err) => {
                    ToastAndroid.show('Đăng nhập thất bại', ToastAndroid.SHORT)
                    setError(`${err}`)
                });
            hideLoader();
        }
    }

    return (
        <>
            <Pressable onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 25, fontFamily:'MontserratAlternates-SemiBold', color: Colors.black }}>ĐĂNG NHẬP</Text>
                </View>
                <View style={{ borderWidth: 0.3, borderColor: Colors.black, marginVertical: 10, flexDirection: 'row', borderRadius: 50 }}>
                    <View style={{ margin: 20 }}>
                        <AntDesign name={'user'} color={Colors.black} size={25} />
                    </View>
                    <View style={{ borderRightWidth: 0.3, marginVertical: 10, borderColor:Colors.black }} />
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <TextInput style={{ flex: 1, color: Colors.black,fontFamily:'MontserratAlternates-Regular' }} numberOfLines={1}
                            placeholder={'Nhập email'}
                            placeholderTextColor={Colors.black}
                            value={valueInput.email}
                            onChangeText={(text) => {
                                setValueInput({
                                    ...valueInput,
                                    email: text
                                })
                                setError('');
                            }}
                        />
                    </View>
                </View>
                <View style={{ borderWidth: 0.3, marginVertical: 10, flexDirection: 'row', borderRadius: 50, borderColor: Colors.black }}>
                    <View style={{ margin: 20 }}>
                        <AntDesign name={'lock'} color={Colors.black} size={25} />
                    </View>
                    <View style={{ borderRightWidth: 0.3, marginVertical: 10,borderColor:Colors.black }} />
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <TextInput style={{ flex: 1, color: Colors.black,fontFamily:'MontserratAlternates-Regular' }} numberOfLines={1}
                            secureTextEntry={true}
                            placeholder={'Nhập mật khẩu'}
                            placeholderTextColor={Colors.black}
                            value={valueInput.password}
                            onChangeText={(text) => {
                                setValueInput({
                                    ...valueInput,
                                    password: text
                                })
                                setError('')
                            }}
                        />
                    </View>
                </View>

                {error === '' ? (null) : (
                    <View>
                        <Text style={{ color: 'red' }}>{error}</Text>
                    </View>
                )}

                <TouchableOpacity activeOpacity={0.5}
                    onPress={() => _login()}
                    style={{ borderRadius: 50, marginVertical: 10, paddingVertical: 10, paddingHorizontal: 30, borderWidth: 0.3, borderColor: Colors.black }}
                >
                    <Text style={{ fontSize: 15, color: Colors.black,fontFamily:'MontserratAlternates-Regular' }}>ĐỒNG Ý</Text>
                </TouchableOpacity>

                <View style={{ marginVertical: 10, flexDirection: 'row' }}>
                    <Text style={{ color: Colors.black,fontFamily:'MontserratAlternates-Regular' }}>Bạn chưa có tài khoản?{' '}</Text>
                    <TouchableOpacity style={{ alignSelf: 'center' }}
                        onPress={() => setIsLoginScreen(false)}
                    >
                        <Text style={{ color: Colors.black, textDecorationLine: 'underline', alignSelf: 'center',fontFamily:'MontserratAlternates-Regular' }}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
                <Toast
                    ref={toast}
                    style={{ backgroundColor: Colors.black }}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: Colors.white }}
                />
            </Pressable>
        </>
    )
}

export default LoginComponent