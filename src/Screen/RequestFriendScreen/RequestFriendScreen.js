import { View, Text, SafeAreaView, Keyboard, RefreshControl, FlatList, ToastAndroid, Pressable, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Colors } from '../../assets/Colors'
import { images } from '../../assets/images'
import HeaderComponent from '../../Components/HeaderComponent/HeaderComponent'
import { useState } from 'react'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import { actSaveInfoUser } from '../../Redux/Actions/AuthAction'
import { useNavigation } from '@react-navigation/native'
import { showLoader, hideLoader } from '../../Components/LoadingSpinner/LoadingSpinner'
const { width, height } = Dimensions.get('screen')
const RequestFriendScreen = () => {
  const { user } = useSelector(state => state.AuthReducer);
  const userid = auth()?.currentUser?.uid;
  const [toggle, setToggle] = useState(0);
  const [listRequestFriend, setListRequestFriend] = useState([]);
  const navi = useNavigation();
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    (async () => {
      const list = await firestore().collection('users').doc(userid).get();
      setListRequestFriend(list.data()?.requestFriend);
    })();
  }, [user]);

  const onRefresh = async () => {
    const updateUserCurrent = await firestore().collection('users').doc(user?.uid).get();
    dispatch(actSaveInfoUser(updateUserCurrent.data()));
  }
  const leftSwipeToAddOrDelete = (item) => {
    return <View style={{flexDirection:'row'}}>
      <TouchableOpacity activeOpacity={0.7} style={{
      backgroundColor: Colors.black,
      width: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderRightWidth:0.5, borderColor:Colors.white
    }}
      onPress={() => _handleAddFriend(item)}
    >
      <View>
        <Text><MaterialCommunityIcons name='check' size={15} color={Colors.white} /></Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity activeOpacity={0.7} style={{
      backgroundColor: Colors.black,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      width: 50,
      justifyContent: 'center',
      alignItems: 'center',
    }}
      onPress={() => _handleDeleteFriend(item)}
    >
      <View>
        <Text><MaterialCommunityIcons name='close' size={15} color={Colors.white} /></Text>
      </View>
    </TouchableOpacity>
    </View>
  }
  const _handleDeleteFriend = async(item) => {
    showLoader();
    const newRequestFriends = user?.requestFriend.filter((rfriend, idx) => {
      return rfriend.uid !== item?.uid
    })
    await firestore().collection('users').doc(user?.uid).update({
      requestFriend: newRequestFriends
    });
    const friendOfUser = await firestore().collection('users').doc(item?.uid).get();
    const arrSenttRequestFriendOfUser = friendOfUser.data()?.sentRequestFriend?.filter((srFriends,index)=>{
      return srFriends.uid !== user?.uid
    })
    await firestore().collection('users').doc(item?.uid).update({
      sentRequestFriend: arrSenttRequestFriendOfUser
    });
    const updateUserCurrent = await firestore().collection('users').doc(userid).get();
      dispatch(actSaveInfoUser(updateUserCurrent.data()));
      hideLoader();
      ToastAndroid.show('Xóa thành công', ToastAndroid.SHORT);
  }
  const _handleAddFriend = async (item) => {
    showLoader();
    const arrFriend = await user?.friends?.every((friend) => {
      return friend !== item?.uid
    })

    if (arrFriend) {
      //   setStatusAddFriend('Đã kết nối ❤️');
      const newArrFriends = [...user?.friends, item?.uid];
      const newRequestFriends = user?.requestFriend.filter((rfriend, idx) => {
        return rfriend.uid !== item?.uid
      })
      await firestore().collection('users').doc(user?.uid).update({
        friends: newArrFriends,
        requestFriend: newRequestFriends
      });
      const friendOfUser = await firestore().collection('users').doc(item?.uid).get();
      const arrFriendOfUser = [...friendOfUser.data()?.friends, user?.uid];
      const arrSenttRequestFriendOfUser = friendOfUser.data()?.sentRequestFriend?.filter((srFriends,index)=>{
        return srFriends.uid !== user?.uid
      })

      await firestore().collection('users').doc(item?.uid).update({
        friends: arrFriendOfUser,
        sentRequestFriend: arrSenttRequestFriendOfUser
      });

      const updateUserCurrent = await firestore().collection('users').doc(userid).get();
      dispatch(actSaveInfoUser(updateUserCurrent.data()));
    }
    hideLoader();
    ToastAndroid.show('Thêm thành công', ToastAndroid.SHORT)
  }
  const _RenderItemRequestFriend = ({ item, index }) => {
    return <GestureHandlerRootView style={{}}>
      <View style={{
        borderWidth: 0.5,
        borderColor: Colors.black,
        marginVertical: 8,
        borderRadius: 10,
        borderRightWidth: 3,
      }}>
        <Swipeable renderRightActions={() => leftSwipeToAddOrDelete(item)} useNativeAnimations={true}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, }}>
            <Text style={{ color: Colors.black,fontFamily:'MontserratAlternates-Regular' }}>{item?.displayName} </Text>
            <Text style={{fontFamily:'MontserratAlternates-Regular'}}>muốn trở thành bạn bè với bạn ❤️</Text>
          </View>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  }
  const goBack = () =>{
    navi.goBack()
  }
  return (
    <SafeAreaView onPress={Keyboard.dismiss} accessible={false}
      style={{
        flex: 1, paddingVertical: 5, paddingHorizontal: 20,
        backgroundColor: Colors.white
      }}>

      {/* Header */}
      <View >
        <HeaderComponent nameRoute={'Lời mời'} rightIcon={images.icons.ic_arrow_left} isRightIcon={true} handleRightButton={goBack} />
      </View>
      {/* chat */}
      <View style={{ flex: 1 }}>
       
       <FlatList
          onScrollBeginDrag={Keyboard.dismiss}
          data={listRequestFriend}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={onRefresh}
            />
          }
          // ListEmptyComponent={<ActivityIndicator size="large" color="#000" />}
          renderItem={_RenderItemRequestFriend}
          keyExtractor={(item, index) => index + 'key'}
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

export default RequestFriendScreen