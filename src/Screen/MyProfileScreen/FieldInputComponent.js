import { View, Text, TextInput, Dimensions, Pressable, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../assets/Colors'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage';
import { utils } from '@react-native-firebase/app';
import { hideLoader, showLoader } from '../../Components/LoadingSpinner/LoadingSpinner';
const { width, height } = Dimensions.get('screen');
const FieldInputComponent = (props) => {
    const { item, index, setValueFieldInput, valueFieldInput, user } = props;
    useEffect(() => {
        if (user !== null) {
            setValueFieldInput({
                ...valueFieldInput,
                username: user?.displayName,
                email: user?.email,
                phonenumber: user?.phoneNumber,
                avatar: user?.photoURL
            });
        }
    }, [user]);
    const _handleOnChangeText = (typeName, text) => {
        switch (typeName) {
            case 'username':
                setValueFieldInput({
                    ...valueFieldInput,
                    username: text
                });
                break;
            case 'email':
                setValueFieldInput({
                    ...valueFieldInput,
                    email: text
                });
                break;
            case 'phonenumber':
                setValueFieldInput({
                    ...valueFieldInput,
                    phonenumber: text
                });
                break;
            case 'avatar':
                setValueFieldInput({
                    ...valueFieldInput,
                    avatar: text
                });
                break;
            default:
                break;
        }
    }
    const _renderValueInput = (typeName) => {

        let renderType = {
            username: valueFieldInput.username,
            email: valueFieldInput.email,
            phonenumber: valueFieldInput.phonenumber,
            avatar: valueFieldInput.avatar,
        }
        return renderType[typeName]
    }
    const pickImage = async () => {

        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                maxHeight: 1000,
                maxWidth: 1000,
                quality: 0.8,

            }, async (data) => {
                showLoader();
                console.log(data.assets);
                if (data?.assets !== undefined) {
                    const reference = storage().ref(`/images/${data.assets[0].fileName}`);
                    await reference.putFile(data.assets[0].uri);
                    const url = await storage().ref(`/images/${data.assets[0].fileName}`).getDownloadURL();
                    await setValueFieldInput({
                        ...valueFieldInput,
                        avatar: `${url}`
                    });
                    hideLoader()
                }else{
                    hideLoader();
                }
            });

        } catch (error) {
            // hideLoader()
            console.log('Người dùng k chọn ảnh',error);

        }
    }
    return (
        <>
            <View key={index} style={{ marginVertical: 10, }}>
                <View style={{ marginBottom: 3 }}>
                    <Text style={{ fontSize: 18, fontFamily: 'MontserratAlternates-SemiBold', color: Colors.black }}>{item?.fieldName}</Text>
                </View>
                {item?.type === 'INPUT' && (
                    <View style={{}}>
                        <TextInput
                            placeholder={`Nhập ${item?.fieldName}`}
                            placeholderTextColor={Colors.black}
                            style={{ fontFamily: 'MontserratAlternates-Regular', color: Colors.black, paddingHorizontal: 15, borderColor: Colors.black, borderWidth: 0.5, borderRadius: 50 }}
                            numberOfLines={1}
                            value={_renderValueInput(item?.typeName)}
                            onChangeText={(text) => _handleOnChangeText(item?.typeName, text)}
                        />
                    </View>
                )}
                {item?.type === 'FILE' && (
                    <View style={{}}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                            <Image source={{ uri: valueFieldInput?.avatar }} style={{ width: width / 2, height: width / 2 }} />
                        </View>
                        <TouchableOpacity
                            onPress={() => pickImage()}
                            activeOpacity={0.5}
                            style={{
                                borderColor: Colors.black,
                                borderRadius: 50,
                                borderWidth: 0.5,
                                flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 15,
                            }}>
                            <Text style={{ color: Colors.black, fontFamily: 'MontserratAlternates-Regular' }}>Chọn</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </>
    )
}

export default FieldInputComponent