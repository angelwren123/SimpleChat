import { View, Text,ToastAndroid, KeyboardAvoidingView, SafeAreaView, Pressable, Keyboard, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderComponent from '../../Components/HeaderComponent/HeaderComponent'
import { Colors } from '../../assets/Colors'
import { images } from '../../assets/images'
import FieldInputComponent from './FieldInputComponent';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { actSaveInfoUser } from '../../Redux/Actions/AuthAction'
import { _EditUser } from '../../utils/firebase';
import { hideLoader, showLoader } from '../../Components/LoadingSpinner/LoadingSpinner';
const MyProfileScreen = () => {
    const route = useRoute();
    const dispatch = useDispatch();
    const navigate = useNavigation()
    const { user } = useSelector(state => state.AuthReducer);
    const [valueFieldInput, setValueFieldInput] = useState({
        username: '',
        email: '',
        phonenumber: '',
        avatar: '',
    });

    const fieldInput = [
        {
            id: 1,
            fieldName: 'Tên Người Dùng',
            typeName: 'username',
            type: 'INPUT',
        },
        // {
        //     id: 2,
        //     fieldName: 'Email',
        //     typeName: 'email',
        //     type: 'INPUT',
        // },
        // {
        //     id: 3,
        //     fieldName: 'Số Điện Thoại',
        //     typeName: 'phonenumber',
        //     type: 'INPUT',
        // },
        {
            id: 4,
            fieldName: 'Ảnh Đại Diện',
            typeName: 'avatar',
            type: 'FILE',
        },

    ];

    const _RenderFieldInput = ({ item, index }) => {
        return <FieldInputComponent
            item={item}
            user={user}
            index={index}
            valueFieldInput={valueFieldInput}
            setValueFieldInput={setValueFieldInput} />
    }

    const _HandleFiedlSubmit = async () => {
        showLoader();
        try {
            await _EditUser(user, valueFieldInput);
            navigate.goBack();
            const userLogged = await firestore().collection('users').doc(user.uid).get();
            dispatch(actSaveInfoUser(userLogged.data()));
            ToastAndroid.show("Cập nhật thành công",ToastAndroid.SHORT);
            hideLoader();
        } catch (error) {
            hideLoader();
            ToastAndroid.show("Cập nhật thất bạt",ToastAndroid.SHORT);
        }
    }
    const goBack = () => {
        navigate.goBack()
    }
    return (
        <>
            <SafeAreaView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1, backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 10 }}>

                {/* Header */}
                <HeaderComponent handleRightButton={goBack} nameRoute={'Chỉnh sửa'} rightIcon={images.icons.ic_arrow_left} isRightIcon={true} />
                {/*  */}
                <View style={{ flex: 1, marginTop: 10 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={fieldInput}
                        extraData={(item, index) => 'key: ' + index}
                        renderItem={_RenderFieldInput}
                        ListFooterComponent={() => {
                            return <>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => _HandleFiedlSubmit()}
                                    style={{ backgroundColor: Colors.black, paddingVertical: 15, borderRadius: 50, paddingHorizontal: 40, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: Colors.white,fontFamily:'MontserratAlternates-Regular' }}>ĐỒNG Ý</Text>
                                </TouchableOpacity>
                            </>
                        }}
                        ListFooterComponentStyle={{ marginTop: 15 }}
                    />
                </View>
            </SafeAreaView>
        </>
    )
}

export default MyProfileScreen