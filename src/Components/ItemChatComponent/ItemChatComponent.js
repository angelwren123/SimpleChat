import React, { useState } from "react";
import { Text, Pressable, View, Image, Platform, UIManager, LayoutAnimation } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore'
import { useSelector } from "react-redux";
import { Colors } from "../../assets/Colors";
import { useEffect } from "react";
import { convertUnixTime } from "../../utils/convert";
import * as Animatable from 'react-native-animatable';
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }
}
const ItemChatComponent = ({ item, index }) => {
    const { user } = useSelector(state => state.AuthReducer);
    const [lastMessage, setLastMessage] = useState('');
    const navigate = useNavigation();
    const [open, setOpen] = useState(false);
    // const handleOnLongPress = () => {
    //     LayoutAnimation.spring();
    //     setOpen(!open)
    // }
    useEffect(() => {
        const docid = item?.uid > user?.uid ? user?.uid + "-" + item?.uid : item?.uid + "-" + user?.uid;
        firestore()
            .collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .orderBy('createdAt', "desc").limit(1).onSnapshot((snap) => {
                let message = '';
                snap?.docs.map((doc) => {
                    const check1 = docid.includes(doc.data()?.sentBy);
                    const check2 = docid.includes(doc.data()?.sentTo);
                    if (check1 && check2) {
                        if (doc.data()?.text && !doc.data()?.image) {
                            message = doc.data().text;
                        }
                        if (doc.data().image && !doc.data().text) {
                            if (doc.data()?.sentTo === user.uid) {
                                message = 'Đã gửi một ảnh';
                            } else {
                                message = 'Bạn đã gửi một ảnh';
                            }
                        }
                    }
                });
                setLastMessage(message);
            });
    }, [user, user?.friends, item]);
    return <>
        <Pressable style={{ marginVertical: 5, }}
            onPress={() => navigate.navigate('ChatScreen', {item:item, displayName: item.displayName, photoURL: item.photoURL, uid: item.uid, token: item?.token })}
        // onLongPress={() => handleOnLongPress()} delayLongPress={800}
        >
            <Animatable.View style={{ flexDirection: 'row' }}
                animation="fadeInUp"
                delay={index * 100}
                useNativeDriver
            >
                <View style={{ padding: 2 }}>
                    <View>
                        <Image source={{ uri: item?.photoURL }} style={{ width: 60, height: 60, borderRadius: 50 }} />
                    </View>
                </View>
                <View style={{ paddingHorizontal: 8, paddingVertical: 3, flex: 1, justifyContent: 'space-around' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontFamily:'MontserratAlternates-SemiBold',fontSize: 20,  color: Colors.black }}>{item?.displayName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{}}>
                            <Text style={{ color: Colors.black,fontFamily:'MontserratAlternates-Regular' }}>
                                {lastMessage !== '' ?
                                    `${lastMessage}`
                                    : `Cùng trò chuyện nào ❤️`}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: Colors.white, padding: 1.5, justifyContent: 'center', alignItems: 'center', borderRadius: 50, flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'center', alignSelf: 'center', }}>
                        <Text style={{fontFamily:'MontserratAlternates-Regular'}}>{item?.status === 'online' ? '' : `${convertUnixTime(item?.status?.seconds)}`}</Text>
                    </View>
                    {item?.status === 'online' && <View style={{ marginLeft: 5, width: 10, height: 10, justifyContent: 'center', alignSelf: 'center', backgroundColor: item?.status === 'online' ? 'green' : 'grey', borderRadius: 50 }} />}
                </View>
            </Animatable.View>
        </Pressable>
    </>
}
export default React.memo(ItemChatComponent);