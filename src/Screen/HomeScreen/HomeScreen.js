import { View, Modal, Text, RefreshControl, StyleSheet, SafeAreaView, Image, ActivityIndicator, TextInput, Keyboard, Pressable, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import auth, { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../assets/Colors';
import { images } from '../../assets/images';
import { useRoute } from '@react-navigation/native';
import HeaderComponent from '../../Components/HeaderComponent/HeaderComponent';
import uuid from 'react-native-uuid';
import SearchComponent from '../../Components/SearchComponent/SearchComponent';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useDispatch } from 'react-redux';
import { actSaveInfoUser } from '../../Redux/Actions/AuthAction'
import { useEffect } from 'react';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { convertUnixTime } from '../../utils/convert';
import { getListFriends, getListFriendsSearch } from '../../Redux/Actions/ListFriendAction';
import ItemChatComponent from '../../Components/ItemChatComponent/ItemChatComponent';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
const { width, height } = Dimensions.get('screen')
const HomeScreen = () => {
  const navigate = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.AuthReducer);
  const { listFriends, listFriendsSearch } = useSelector(state => state.ListFriendsReducer)
  const [refreshing, setRefresing] = React.useState(false);
  const [searchValue, setSearchValue] = useState("");

  const _RenderItemChat = ({ item, index }) => {
    return <ItemChatComponent item={item} index={index} />
  }
  const onRefresh = async () => {
    const updateUserCurrent = await firestore().collection('users').doc(user?.uid).get();
    dispatch(actSaveInfoUser(updateUserCurrent.data()));
  }

  useEffect(() => {
    const unSubscribe = firestore().collection('users').onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(async doc => {
        const { displayName, email, phoneNumber, photoURL, status, friends, token, requestFriend, sentRequestFriend } = doc.data();
        await user?.friends?.forEach(friend => {
          if (friend === doc.id) {
            list.push({
              uid: doc.id,
              email: email,
              displayName: displayName,
              phoneNumber: phoneNumber,
              photoURL: photoURL,
              status: status,
              friends: friends,
              token: token,
              requestFriend,
              sentRequestFriend
            });
          }
        });
      });
      dispatch(getListFriends(list));
    });
    return () => unSubscribe();
  }, [user, user?.friends]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== "") {
        const data = listFriends?.filter((friend, index) => {
          return friend?.displayName?.includes(searchValue);
        });
        dispatch(getListFriendsSearch(data));
      }
    }, 250);
    return () => {
      clearTimeout(timeout);
    }
  }, [searchValue]);

  const loadMoreItem = () => {
    // console.log(CurrentPage);
    // setListLimit(state => state + 10)
  }
  const test = () => {
    crashlytics().crash();
  }
  return (
    <SafeAreaView onPress={Keyboard.dismiss} accessible={false}
      style={{
        flex: 1, paddingVertical: 5, paddingHorizontal: 20,
        backgroundColor: Colors.white
      }}>

      {/* Header */}
      <View >
        <HeaderComponent nameRoute={'Liên hệ'} rightIcon={images.icons.ic_pen} isRightIcon={true} />
      </View>
      {/* chat */}
      <View style={{ flex: 1, }}>

        <FlatList
          onScrollBeginDrag={Keyboard.dismiss}
          onEndReached={() => { loadMoreItem() }}
          onEndReachedThreshold={0.1}
          data={searchValue === "" ? listFriends : listFriendsSearch}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          //ListEmptyComponent={<Text style={{fontFamily:'MontserratAlternates-Regular',alignSelf:'center',}}>Chưa có liên hệ nào</Text>}
          renderItem={_RenderItemChat}
          keyExtractor={(item, index) => index + 'key'}
          ListHeaderComponent={<View style={{}}>
            <SearchComponent searchValue={searchValue} setSearchValue={setSearchValue} />
          </View>}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {/* <View>
        <Pressable onPress={() => test()}>
          <Text>Click</Text>
        </Pressable>
      </View> */}
    </SafeAreaView>

  )
}

export default HomeScreen
