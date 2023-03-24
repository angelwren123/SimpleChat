import { View, Text, Image, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, StyleSheet, Pressable, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, InputToolbar, Actions, Send } from 'react-native-gifted-chat'
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore'
import { Colors } from '../../assets/Colors';
import { launchImageLibrary } from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';
import { images } from '../../assets/images';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging'
import NotificationService from '../../utils/NotificationService'
import auth from '@react-native-firebase/auth';
import moment from 'moment/moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { hideLoader, showLoader } from '../../Components/LoadingSpinner/LoadingSpinner';
const { width, height } = Dimensions.get('screen')
const ChatScreen = (props) => {
    const { item, displayName, uid, photoURL, token } = props?.route?.params;
    const [clonedToken, setClonedToken] = useState(token)
    const [messages, setMessages] = useState([]);
    const { user } = useSelector(state => state.AuthReducer);
    const navi = useNavigation();
    useEffect(() => {
        showLoader();
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
        const messageRef = firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .orderBy('createdAt', "desc");


        const unSubscribe = messageRef.onSnapshot((querySnap) => {
            const allmsg = querySnap.docs.map(docSanp => {
                const data = docSanp.data();
                if (data.createdAt) {
                    return {
                        ...docSanp.data(),
                        createdAt: docSanp.data().createdAt.toDate()
                    }
                } else {
                    return {
                        ...docSanp.data(),
                        createdAt: new Date()
                    }
                }

            });
            setMessages(allmsg)

        })
        hideLoader();
        return () => {
            unSubscribe()
        }
    }, []);
    useEffect(() => {
        if (!clonedToken) {
            const unSubscribe = firestore().collection('users').doc(uid).onSnapshot(querySnapshot => {
                setClonedToken(querySnapshot.data().token)
            });
            return () => unSubscribe()
        }
    }, [clonedToken])
    
    const onSend = (messageArray) => {
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy: user.uid,
            sentTo: uid,
            createdAt: new Date()
        }
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid

        firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() });

        let notificationData = {
            title: user?.displayName,
            body: mymsg?.text ? mymsg?.text : 'Đã gửi một tin nhắn',
            token: clonedToken,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
            uid: user?.uid,
        };
        if(clonedToken!=="") NotificationService.sendSingleDeviceNotification(notificationData);
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
    }

    const renderAvatar = () => {
        return <TouchableOpacity activeOpacity={0.3}
            onPress={() => navi.navigate('ProfileUserScreen', { user: item })}
        >
            <Image source={{ uri: photoURL }} style={{ width: 36, height: 36, borderRadius: 50 }} />
        </TouchableOpacity>
    };

    const renderActions = (props) => {
        return (
            <Actions
                {...props}
                options={{
                    ['Chọn hình ảnh']: async (props1) => {
                        try {
                            const result = await launchImageLibrary({
                                mediaType: 'photo',
                                maxHeight: 1000,
                                maxWidth: 1000,
                                quality: 0.8,

                            }, async (data) => {
                                const reference = storage().ref(`/images/${data.assets[0].fileName}`);
                                await reference.putFile(data.assets[0].uri);
                                const url = await storage().ref(`/images/${data.assets[0].fileName}`).getDownloadURL();
                                const mymsg = {
                                    '_id': `${uuid.v4()}`,
                                    'user': { _id: user.uid },
                                    'createdAt': new Date(),
                                    'image': url,
                                }
  
                                
                                const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
                                await firestore().collection('chatrooms')
                                    .doc(docid)
                                    .collection('messages')
                                    .add({
                                        ...mymsg,
                                        createdAt: firestore.FieldValue.serverTimestamp(),
                                        sentBy: user.uid,
                                        sentTo: uid,
                                    });
                                let notificationData = {
                                    body: 'Đã gửi một ảnh',
                                    title: user?.displayName,
                                    token: clonedToken,
                                    displayName: user?.displayName,
                                    photoURL: user?.photoURL,
                                    uid: user?.uid,
                                };
                                if(clonedToken!=="") NotificationService.sendSingleDeviceNotification(notificationData);
                            })
                        } catch (e) {
                            console.log('error', e);
                        }
                    },
                    ['Hủy bỏ']: (props) => { console.log("Cancel") }
                }}
                onSend={args => console.log(args)}
                
                iconTextStyle={{ color: '#000', fontFamily:'MontserratAlternates-Regular' }}
                
            // wrapperStyle={{}}
            >


            </Actions>
        )
    };

    const renderSend = (sendProps) => {
        return (
            <Send {...sendProps} containerStyle={{ borderTopWidth: 0 }} >
                <View style={{ margin: 10, }}>
                    <MaterialIcons name={'send'} size={25} color='#000' />
                </View>
            </Send>
        );
    }
    return (
        <SafeAreaView style={style.container}>
            <View style={{ backgroundColor: Colors.black, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: Colors.white, flexDirection: 'row' }}>
                <Pressable
                    onPress={() => navi.goBack()}
                    style={{ alignSelf: 'center', borderRadius: 50, marginHorizontal: 20, backgroundColor: Colors.white, padding: 5 }}>
                    <Image source={images.icons.ic_arrow_left} style={{ width: 20, height: 20, tintColor: Colors.black, }} />
                </Pressable>
                <Pressable style={{}}>
                    <Text style={{ fontSize: 23, color: Colors.white,fontFamily:'MontserratAlternates-Regular' }}>{displayName}</Text>
                </Pressable>
            </View>
            <GiftedChat
                renderAvatar={renderAvatar}
                messages={messages}
                renderChatEmpty={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text
                            style={{
                                transform: [{ scaleY: -1 }],fontFamily:'MontserratAlternates-Regular'
                            }}>
                            Chưa có cuộc trò chuyện nào
                        </Text>
                    </View>
                )}

                renderSend={(props) => renderSend(props)}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user.uid,
                }}
                onPressAvatar={() => {
                    return null;
                }}
                alwaysShowSend={true}
                isTyping={true}
                placeholder={'Nhập tin nhắn ...'}
                
                timeTextStyle={{ left: { color: Colors.white }, right: { color: Colors.black } }}
                imageStyle={{ width: width / 2, height: width / 2, }}
                renderActions={(messages) => renderActions(messages)}
                renderBubble={(props) => {
                    return <Bubble
                        {...props}
                        wrapperStyle={{
                            right: {
                                backgroundColor: Colors.white,

                            },
                            left: {
                                backgroundColor: Colors.black
                            },
                        }}
                        textStyle={{
                            right: {
                                color: Colors.black,
                                fontSize: 15,
                                fontFamily:'MontserratAlternates-Regular'
                            },

                            left: {
                                color: Colors.white,
                                fontSize: 15,
                                fontFamily:'MontserratAlternates-Regular'
                            },
                        }}
                    />
                }}
                // renderInputToolbar={renderInputToolbar}
                renderLoading={() => (
                    <ActivityIndicator size={'large'} />
                )}
                renderInputToolbar={(props) => {
                    return <InputToolbar {...props}
                        containerStyle={{ borderTopWidth: 1, borderTopColor: Colors.gray }}
                        textInputStyle={{ color: '#000', }}
                    />
                }}
            />
        </SafeAreaView>
    )
}

export default ChatScreen

const style = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent:'center', alignItems:'center'
    }
})