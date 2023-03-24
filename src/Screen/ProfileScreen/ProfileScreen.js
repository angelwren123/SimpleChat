import { StyleSheet,ToastAndroid, Text, View, Alert, Keyboard, Dimensions, Image, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../assets/Colors'
import { images } from '../../assets/images'
import HeaderComponent from '../../Components/HeaderComponent/HeaderComponent'
import { useRoute } from '@react-navigation/native'
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native'
import HeaderProfileComponent from '../../Components/HeaderProfileComponent/HeaderProfileComponent'
import { useSelector } from 'react-redux'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { actSaveInfoUser } from '../../Redux/Actions/AuthAction';
import auth, { firebase } from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';
import messaging from '@react-native-firebase/messaging';
import useLoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';
import { showLoader, hideLoader } from '../../Components/LoadingSpinner/LoadingSpinner'
const { width, height } = Dimensions.get('screen');

const _TabName = [
  {
    id: uuid.v4(),
    name: 'Trang cá nhân',
    icon: images.icons.ic_user,
    nameScreen: 'MyProfileScreen'
  },
  {
    id: uuid.v4(),
    name: 'Lời mời kết bạn',
    icon: images.icons.ic_user_three,
    nameScreen: 'RequestFriendScreen'
  },

]
const ProfileScreen = () => {
  const route = useRoute();
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.AuthReducer)
  const _RenderTabName = ({ item, index }) => {
    return <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigate.navigate(`${item?.nameScreen}`)}
        style={{ marginHorizontal: 20, padding: 15, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, }}>
        <View style={{ marginHorizontal: 10 }}>
          <Image source={item?.icon} style={{ width: 30, height: 30, tintColor: Colors.black }} />
        </View>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={{fontFamily:'MontserratAlternates-Regular', color: Colors.black, fontSize: 20 }}>{item?.name}</Text>
        </View>
        {item?.nameScreen === 'RequestFriendScreen' && (
          <View style={{ justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ color: 'red', fontSize: 18,fontFamily:'MontserratAlternates-SemiBold' }}>{user?.requestFriend?.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    </>
  }
  const showAlert = () =>
    Alert.alert(
      'Đăng xuất',
      'Bạn có muốn đăng xuất?',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => console.log('cancel'),
          style: 'cancel',
        },
        { text: 'Đồng ý', onPress: () => _Logout() },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          console.log('cancel'),
      },
    );
  const _Logout = async () => {
    
    try {
      showLoader();
      await messaging().deleteToken();
      await firestore().collection('users').doc(user.uid).update({
        status: firestore.FieldValue.serverTimestamp(),
        token: "",
      });
      await auth().signOut();
      navigate.navigate('WelcomeScreen');
      // navigate.goBack();
      hideLoader();
      ToastAndroid.show('Đăng xuất thành công', ToastAndroid.SHORT)
    } catch (error) {
      console.log(error)
      hideLoader();
    }
  }
  return (
    <SafeAreaView onPress={Keyboard.dismiss} accessible={false}
      style={{
        flex: 1, paddingVertical: 10, paddingHorizontal: 20,
        backgroundColor: Colors.white
      }}>
      {/* Header */}

      <View style={{}}>
        <HeaderComponent handleRightButton={showAlert} nameRoute={'Tài khoản'} rightIcon={images.icons.ic_logout} isRightIcon={true} />
      </View>
      {/* info */}

      <View style={{ flex: 1, }}>
        <FlatList
          data={_TabName}
          renderItem={_RenderTabName}
          keyExtractor={(item, index) => 'key: ' + index}
          ListHeaderComponent={<HeaderProfileComponent user={user} />}
        />
      </View>


    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})