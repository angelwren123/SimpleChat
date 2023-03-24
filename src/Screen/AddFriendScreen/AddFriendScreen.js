import { View, Text, KeyboardAvoidingView, Pressable, Keyboard, Image, TextInput, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useNavigation, useRoute } from '@react-navigation/native'
import HeaderComponent from '../../Components/HeaderComponent/HeaderComponent'
import SearchComponent from '../../Components/SearchComponent/SearchComponent'
import { images } from '../../assets/images'
import { Colors } from '../../assets/Colors'
import { useEffect } from 'react'
import { color } from 'react-native-reanimated'
import { hideLoader, showLoader } from '../../Components/LoadingSpinner/LoadingSpinner'
const AddFriendScreen = () => {
  const route = useRoute();
  const navigate = useNavigation()
  const [searchEmail, setSearchEmail] = useState('');
  const [searchUser, setSearchUser] = useState([]);
  const [searchEmpty, setSearchEmpty] = useState('');
  const _handleSearch = async () => {
    // showLoader();
    const users = await firestore()
      .collection('users')
      .where('email', '==', `${searchEmail}`).get().then((snap) => {
        const list = [];
        snap?.forEach((data) => {
          list.push(data.data());
        })
        if (list.length > 0) {
          navigate.navigate('ProfileUserScreen', { user: list[0] })
        } else {
          setSearchEmpty('Người dùng này không tồn tại!');
        }
      })
    // hideLoader();
    return () => users();
  }

  // useEffect(() => {
  //   console.log('sdsd');
  //   if (searchUser.length !== 0) {
  //     setSearchEmpty('');
  //     const newUser = searchUser[0];
  //     navigate.navigate('ProfileUserScreen', { user: newUser })
  //   } else if (searchUser.length === 0 && searchEmail !== '') {
  //     setSearchEmpty('Người dùng này không tồn tại!')
  //   } else {
  //     setSearchEmpty('')
  //   }
  // }, [searchUser])

  return (

    <SafeAreaView onPress={Keyboard.dismiss} accessible={false}
      style={{
        flex: 1, paddingHorizontal: 20, paddingVertical: 10,
        backgroundColor: Colors.white
      }}>
      {/* Header */}
      <HeaderComponent nameRoute={'Tìm kiếm'} isRightIcon={false} />
      {/*  */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: Colors.black, fontSize: 20, fontFamily:'MontserratAlternates-SemiBold' }}>Tìm kiếm liên hệ ❤️</Text>
        </View>
        <View style={{ borderBottomColor: Colors.black, flexDirection: 'row', }}>
          <View style={{ flex: 0.85, borderRightColor: Colors.black, borderRightWidth: 0.5, }}>
            <TextInput
              style={{ color: Colors.black,fontFamily:'MontserratAlternates-Regular' }}
              placeholderTextColor={Colors.black}
              placeholder={'Tìm bởi email...'}
              value={searchEmail}
              onChangeText={(txt) => {
                setSearchEmpty("")
                setSearchEmail(txt);
              }}
            />
          </View>
          <Pressable
            onPress={() => _handleSearch()}
            style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={images.icons.ic_search} style={{ width: 28, height: 28 }} />
          </Pressable>
        </View>
        {searchEmpty !== '' ? (
          <><Text style={{ color: 'red',fontFamily:'MontserratAlternates-Regular' }}>*{searchEmpty}</Text></>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  )
}

export default AddFriendScreen