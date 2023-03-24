import { View, Text, SafeAreaView, Dimensions, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useMemo } from 'react'
import { Colors } from '../../assets/Colors';
import { images } from '../../assets/images';
import HeaderProfileComponent from '../../Components/HeaderProfileComponent/HeaderProfileComponent';
import HeaderComponent from '../../Components/HeaderComponent/HeaderComponent';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore'
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actSaveInfoUser } from '../../Redux/Actions/AuthAction';
import { useNavigation } from '@react-navigation/native';
import { color } from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather'
import { hideLoader, showLoader } from '../../Components/LoadingSpinner/LoadingSpinner';

const { width, height } = Dimensions.get('screen');
const ProfileUserScreen = (props) => {
  const { user } = props?.route?.params;// nguoi dung dang tim kiem
  const dispatch = useDispatch();
  const navigate = useNavigation()
  const userCurrent = useSelector(state => state.AuthReducer.user);// nguoi dung da dang nhap
  const [statusAddFriend, setStatusAddFriend] = useState('❤️');

  useEffect(() => {
    (async () => {
      showLoader();
      const userData = await firestore().collection('users').doc(user?.uid).get();
      const userCurrentData = await firestore().collection('users').doc(userCurrent?.uid).get();
      const checkRequestFriendUserData = await userData?.data()?.requestFriend?.every((req) => {
        return req?.uid !== userCurrent?.uid
      });
      const checkSentRequestFriendUserCurrentData = await userCurrentData?.data()?.sentRequestFriend?.every((req) => {
        return req?.uid !== user?.uid
      });

      const checkRequestFriendUserData2 = await userData?.data()?.sentRequestFriend?.every((req) => {
        return req?.uid !== userCurrent?.uid
      });
      const checkSentRequestFriendUserCurrentData2 = await userCurrentData?.data()?.requestFriend?.every((req) => {
        return req?.uid !== user?.uid
      });
      const check = await userCurrent?.friends?.every((friend) => {
        return friend !== user?.uid
      });
      if (!check) {
        setStatusAddFriend('Đã kết nối ❤️')
      }else{
        setStatusAddFriend('Kết nối ❤️')
      }
      if(!checkRequestFriendUserData2 && !checkSentRequestFriendUserCurrentData2){
        setStatusAddFriend('Đồng ý ❤️');
      }
      if (!checkRequestFriendUserData && !checkSentRequestFriendUserCurrentData){
        setStatusAddFriend('Đã gửi kết nối ❤️');
      }
      
      hideLoader()
    })()

  }, [user]);
  const _handleAddFriend = async () => {
    showLoader();
    const getFriends = await firestore().collection('users').doc(userCurrent?.uid).get();//check bb của mình
    const checkFriends1 = await getFriends.data()?.friends?.every((friend) => {
      return friend !== user?.uid;
    });
    const getMyFriends = await firestore().collection('users').doc(user?.uid).get();//check bb của đối phương
    const checkFriends2 = await getMyFriends.data()?.friends?.every((friend) => {
      return friend !== userCurrent?.uid;
    });

    if (checkFriends1 && checkFriends2) {
      console.log('true het');
      const friendOfUser = await firestore().collection('users').doc(user?.uid).get();
      const getSentRequestFriend = await friendOfUser.data()?.sentRequestFriend?.filter((rfriend, idx) => {
        return rfriend?.uid !== userCurrent?.uid
      })
      const arrFriendOfUser = [...friendOfUser.data()?.friends, userCurrent?.uid];
      await firestore().collection('users').doc(user?.uid).update({
        friends: arrFriendOfUser,
        sentRequestFriend: getSentRequestFriend,
      });// thêm mình vào ds bb của nó và xóa lời mời của nó


      const getMyFriend = await firestore().collection('users').doc(userCurrent?.uid).get();
      const getRequestFriend = await getMyFriend?.data()?.requestFriend?.filter((rfriend, idx) => {
        return rfriend?.uid !== user?.uid
      })
      const arrMyFriends = [...getMyFriend.data()?.friends, user?.uid];
      await firestore().collection('users').doc(userCurrent?.uid).update({
        friends: arrMyFriends,
        requestFriend: getRequestFriend,
      });// thêm nó vào ds bb của mình và xóa lời mời của mình

      const updateUserCurrent = await firestore().collection('users').doc(userCurrent?.uid).get();
      dispatch(actSaveInfoUser(updateUserCurrent.data()));
      setStatusAddFriend('Đã kết nối ❤️');
    }
    hideLoader();
  };

  const _handleFriendRequest = async () => {
    showLoader();
    const check = user?.requestFriend.every((request, idx) => {
      return request?.uid !== user?.uid
    });// kiểm tra danh sách lời mời kb của đối phương đã có mình hay chưa.
    const check2 = userCurrent?.sentRequestFriend.every((request, idx) => {
      return request?.uid !== user?.uid
    });// kiểm tra danh sách kb của mình xem  đã có đối phương hay chưa.
    if (check && check2) {
      const newFriendRequest = [...user?.requestFriend, { uid: userCurrent?.uid, displayName: userCurrent?.displayName }];
      await firestore().collection('users').doc(user?.uid).update({
        requestFriend: newFriendRequest
      });// thêm mình vào danh sách y/c kết bạn của đối phương

      const newSentFriendRequest = [...userCurrent?.sentRequestFriend, { uid: user?.uid, displayName: user?.displayName }];
      await firestore().collection('users').doc(userCurrent?.uid).update({
        sentRequestFriend: newSentFriendRequest
      });// thêm đối phương vào danh sách kết bạn của mình.

      const updateUserCurrent = await firestore().collection('users').doc(userCurrent?.uid).get();
      dispatch(actSaveInfoUser(updateUserCurrent.data()));
      setStatusAddFriend('Đã gửi kết nối ❤️');
    }
    hideLoader()
  };
  const showAlert = () =>
    Alert.alert(
      'Hủy kết nối',
      'Nếu bạn hủy kết nối, bạn sẽ không thể liên lạc được với người này?',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => console.log('cancel'),
          style: 'cancel',
        },
        { text: 'Đồng ý', onPress: () => _handleRemoveFriend() },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          console.log('cancel'),
      },
    );

  const _handleRemoveFriend = async () => {
    const arrFriend = await userCurrent?.friends?.some((friend) => {
      // if(friend === user?.uid){
      //   console.log(friend, user?.uid);
      // }
      return friend === user?.uid
    });
    if (arrFriend) {
      setStatusAddFriend('Kết nối ❤️');
      const arrFriend = await userCurrent?.friends?.filter((friend) => {
        return friend !== user?.uid
      });
      const arrUserFriend = await user?.friends?.filter((friend) => {
        return friend !== userCurrent?.uid
      });
      await firestore().collection('users').doc(userCurrent?.uid).update({
        friends: arrFriend
      });
      await firestore().collection('users').doc(user?.uid).update({
        friends: arrUserFriend
      });

      const updateUserCurrent = await firestore().collection('users').doc(userCurrent?.uid).get();
      dispatch(actSaveInfoUser(updateUserCurrent.data()));
    }
  }
  const goBack = () => {
    navigate.goBack();
  }
  const renderHeader = useMemo(() => {
    return <HeaderProfileComponent user={user} />
  }, [user]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 10 }}>
      {/* Header */}
      <View style={{}}>
        <HeaderComponent nameRoute={'Trang cá nhân'} handleRightButton={goBack} rightIcon={images.icons.ic_arrow_left} isRightIcon={true} />
      </View>
      {renderHeader}
      {userCurrent?.uid !== user?.uid ?
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          {(statusAddFriend === "Đã kết nối ❤️" || statusAddFriend === "Đã gửi kết nối ❤️") && <>
            <View
              style={{
                paddingHorizontal: 40,
                paddingVertical: 15,
                borderRadius: 50, borderWidth: 0.5,
                borderColor: Colors.black
              }}
            >
              <Text style={{ color: Colors.black,fontFamily:'MontserratAlternates-Regular' }}>{statusAddFriend}</Text>
            </View>
          </>}

          {statusAddFriend === "Kết nối ❤️" &&
            <TouchableOpacity
              onPress={() => _handleFriendRequest()}
              activeOpacity={0.5}
              style={{
                paddingHorizontal: 40,
                paddingVertical: 15,
                borderRadius: 50, borderWidth: 0.5,
                borderColor: Colors.black
              }}
            >
              <Text style={{ color: Colors.black,fontFamily:'MontserratAlternates-Regular' }}>{statusAddFriend}</Text>
            </TouchableOpacity>
          }
          {statusAddFriend === "Đồng ý ❤️" &&
            <TouchableOpacity
              onPress={() => _handleAddFriend()}
              activeOpacity={0.5}
              style={{
                paddingHorizontal: 40,
                paddingVertical: 15,
                borderRadius: 50, borderWidth: 0.5,
                borderColor: Colors.black
              }}
            >
              <Text style={{ color: Colors.black,fontFamily:'MontserratAlternates-Regular' }}>{statusAddFriend}</Text>
            </TouchableOpacity>
          }
          {statusAddFriend === 'Đã kết nối ❤️' && <>
            <TouchableOpacity
              onPress={() => showAlert()}
              activeOpacity={0.5}
              style={{
                marginLeft: 10,
                padding: 10,
                borderRadius: 50, borderWidth: 0.5,
                borderColor: Colors.black
              }}
            >
              <Feather name='user-x' size={20} />
            </TouchableOpacity>
          </>}
          {/*  */}
        </View>
        :
        <>
        </>}

    </SafeAreaView>
  )
}

export default ProfileUserScreen