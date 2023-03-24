import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  Text,
  Platform,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity
} from 'react-native';
import { images } from '../../assets/images';
import useCard from '../../CustomHook/useCard';
import firestore from '@react-native-firebase/firestore'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../assets/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { getUsersRecommend } from '../../Redux/Actions/UsersRecommendAction';
import { actSaveInfoUser } from '../../Redux/Actions/AuthAction';
import { hideLoader, showLoader } from '../../Components/LoadingSpinner/LoadingSpinner';
const { width } = Dimensions.get('screen');
const dataTemp = [
  {
    image: images.images.cat,
    id: 1,
    name: "Bobo",
    animal: 'Cat',
  },
  {
    image: images.images.dog,
    id: 2,
    name: "Dolly",
    animal: 'Dog',
  },
  {
    image: images.images.giraffe,
    id: 3,
    name: "Milo",
    animal: 'Giraffe',
  },
  {
    image: images.images.goat,
    id: 4,
    name: "Ollie",
    animal: 'Goat'
  },
]

function RecommendFriendsScreen() {
  // initialize data to render
  const { usersRecommend } = useSelector(state => state.UsersRecommendReducer);
  const { user } = useSelector(state => state.AuthReducer);
  const [data, _panResponder, animation, scale, opacity, setData] = useCard(usersRecommend);
  const navigate = useNavigation()
  const animationBtn = useRef(new Animated.Value(0)).current;
  const scaleBtn = animationBtn.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });
  const dispatch = useDispatch()
  const onPressIn = () => {
    Animated.spring(animationBtn, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    setTimeout(() => {
      Animated.spring(animationBtn, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }, 200);
  };
  const reLoad = () => {
    showLoader();
    setData(usersRecommend);
    hideLoader();
    // const updateUserCurrent = await firestore().collection('users').doc(user?.uid).get();
    // dispatch(actSaveInfoUser(updateUserCurrent.data()));
  }
  return (
    <>

      <View style={styles.container}>
        <View style={{ position: 'absolute', top: 20 }}>
          <Text style={{ fontSize: 23, fontFamily:'MontserratAlternates-SemiBold', color: Colors.black }}>Gợi ý ❤️</Text>
        </View>
        {data.length > 0 ? data
          .slice(0, 2)
          .reverse()
          .map((item, index, items) => {
            const isLastItem = index === items.length - 1;
            const panHandlers = isLastItem ? { ..._panResponder.panHandlers } : {};
            const isSecondToLast = index === items.length - 2;
            const rotate = animation.x.interpolate({
              inputRange: [-200, 0, 200],
              outputRange: ['-30deg', '0deg', '30deg'],
              extrapolate: 'clamp',
            });

            const animatedCardStyles = {
              transform: [{ rotate }, ...animation.getTranslateTransform()],
              opacity,
            };

            const cardStyle = isLastItem ? animatedCardStyles : undefined;
            const nextStyle = isSecondToLast
              ? { transform: [{ scale: scale }], borderRadius: 5 }
              : undefined;

            return (
              <Animated.View
                {...panHandlers}
                style={[styles.card, cardStyle, nextStyle]}
                key={index}>
                <Pressable style={styles.imageContainer}
                  onPress={() => navigate.navigate('ProfileUserScreen', { user: item })}
                >
                  <Image resizeMode="cover" source={{ uri: item?.photoURL }} style={styles.image} />
                </Pressable>
                <View style={styles.textContainer}>
                  <Text style={styles.nameText}>{item?.displayName}</Text>
                  <Text style={styles.animalText}>{item?.email}</Text>
                </View>
              </Animated.View>
            );
          }) : <>
          <Text>Không còn người dùng nào!</Text>
        </>}
        <Animated.View style={[styles.button, { transform: [{ scale: scaleBtn }] }]}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={1}
            onPressIn={onPressIn}
            onPress={reLoad}
            onPressOut={onPressOut}>
            <Text style={styles.btnText}>
              <AntDesign name='sync' size={20} />
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.white
  },
  card: {
    elevation: 1,
    width: '100%',
    height: width * 1.2,
    backgroundColor: Colors.white,
    position: 'absolute',
    borderRadius: 10,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      web: {
        boxShadow: '0 3px 5px rgba(0,0,0,0.10), 1px 2px 5px rgba(0,0,0,0.10)',
      },
    }),
    borderWidth: 0.5,
    borderColor: '#FFF',
  },
  imageContainer: {
    flex: 1
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  textContainer: {
    padding: 10
  },
  nameText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily:'MontserratAlternates-SemiBold'
  },
  animalText: {
    fontSize: 14,
    color: Colors.black,
    paddingTop: 5,
    fontFamily:'MontserratAlternates-Regular'
  },
  button: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 50,
    borderColor: Colors.black,
    borderWidth: 0.5
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: Colors.black,
    fontSize: 23
  }
});


export default RecommendFriendsScreen;