import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Keyboard,ToastAndroid, TouchableWithoutFeedback, SafeAreaView, StyleSheet, Text, View, TextInput, Dimensions, Pressable, TouchableOpacity, } from 'react-native'
import React, { useEffect, useState, useRef } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../assets/Colors';
import Toast from 'react-native-easy-toast';
import { useDispatch } from 'react-redux';
import md5 from 'md5';
import { _AddANewUser } from '../../utils/firebase';
import { actSaveInfoUser } from '../../Redux/Actions/AuthAction';
import messaging from '@react-native-firebase/messaging'
import { hideLoader, showLoader } from '../LoadingSpinner/LoadingSpinner';
const RegisterComponent = (props) => {
    const { setIsLoginScreen } = props;
    const toast = useRef();
    const navigate = useNavigation();
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [valueInput, setValueInput] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const _checkFieldValue = () => {
        if (valueInput.confirmPassword === "" || valueInput.password === "" || valueInput.confirmPassword === "") {
            setError('Please fill in information!')
            return false;
        }
        if (valueInput.confirmPassword !== valueInput.password) {
            setError('Don\'t match the password entered!')
            return false;
        }
        return true;
    }
    const _register = async () => {
        if (_checkFieldValue()) {
            await auth()
                .createUserWithEmailAndPassword(valueInput.email, valueInput.password)
                .then(async (credentials) => {
                    showLoader();
                    await _AddANewUser(credentials)
                        .then(async (data) => {
                            ToastAndroid.show('Đăng ký thành công', ToastAndroid.SHORT)
                            navigate.navigate('MainScreen');
                        })
                        .catch(err => {
                            setError(`${err.message}`)
                        });
                    hideLoader();

                })
                .catch(error => {
                    showLoader();
                    if (error.code === 'auth/email-already-in-use') {
                        setError('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        setError('That email address is invalid!');
                    }
                    setError(`${error?.message}`);
                    hideLoader();
                });


        }
    }
    return (
        <>
            <Pressable onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 25, fontFamily:'MontserratAlternates-SemiBold', color: Colors.black }}>ĐĂNG KÝ</Text>
                </View>
                {/* field email */}
                <View style={{ borderWidth: 0.3, marginVertical: 10, flexDirection: 'row', borderRadius: 50, borderColor: Colors.black }}>
                    <View style={{ margin: 20 }}>
                        <AntDesign name={'user'} color={Colors.black} size={25} />
                    </View>
                    <View style={{ borderRightWidth: 0.3, marginVertical: 10,borderColor:Colors.black }} />
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

                {/* field password */}
                <View style={{ borderColor: Colors.black, borderWidth: 0.3, marginVertical: 10, flexDirection: 'row', borderRadius: 50 }}>
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

                {/* field confirm password */}
                <View style={{ borderColor: Colors.black, borderWidth: 0.3, marginVertical: 10, flexDirection: 'row', borderRadius: 50 }}>
                    <View style={{ margin: 20 }}>
                        <AntDesign name={'lock'} color={Colors.black} size={25} />
                    </View>
                    <View style={{ borderRightWidth: 0.3, marginVertical: 10,borderColor:Colors.black }} />
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <TextInput style={{ flex: 1, color: Colors.black,fontFamily:'MontserratAlternates-Regular' }} numberOfLines={1}
                            secureTextEntry={true}
                            placeholder={'Nhập lại mật khẩu'}
                            placeholderTextColor={Colors.black}

                            value={valueInput.confirmPassword}
                            onChangeText={(text) => {
                                setValueInput({
                                    ...valueInput,
                                    confirmPassword: text
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
                    onPress={() => _register()}
                    style={{ borderRadius: 50, borderColor: Colors.black, marginVertical: 10, paddingVertical: 10, paddingHorizontal: 30, borderWidth: 0.3 }}
                >
                    <Text style={{ fontSize: 15, color: Colors.black,fontFamily:'MontserratAlternates-Regular' }}>ĐỒNG Ý</Text>
                </TouchableOpacity>

                <View style={{ marginVertical: 10, flexDirection: 'row' }}>
                    <Text style={{ color: Colors.black,fontFamily:'MontserratAlternates-Regular' }}>Bạn đã có tài khoản?{' '}</Text>
                    <TouchableOpacity style={{ alignSelf: 'center' }}
                        onPress={() => setIsLoginScreen(true)}
                    >
                        <Text style={{ color: Colors.black, textDecorationLine: 'underline', alignSelf: 'center',fontFamily:'MontserratAlternates-Regular' }}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
                <Toast
                    ref={toast}
                    style={{ backgroundColor: Colors.black }}
                    position='bottom'
                    positionValue={100}
                    fadeInDuration={200}
                    fadeOutDuration={1000}
                    opacity={1}
                    textStyle={{ color: Colors.white }}
                />
            </Pressable>
        </>
    )
}

export default RegisterComponent