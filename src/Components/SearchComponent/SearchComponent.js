import { View, Text,TextInput,Image } from 'react-native'
import React from 'react'
import { Colors } from '../../assets/Colors'
import { images } from '../../assets/images'
import { useState } from 'react'
import { useEffect } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useSelector,useDispatch } from 'react-redux'
import { getListFriends } from '../../Redux/Actions/ListFriendAction'
const SearchComponent = (props) => {
    
    const { listFriends, listFriendsSearch } = useSelector(state => state.ListFriendsReducer)
    const { user } = useSelector(state => state.AuthReducer);
    const dispatch = useDispatch()
    // useEffect(()=>{
    //     const timeout = setTimeout(()=>{
    //         if(searchValue!==""){
    //             const data = listFriends?.filter((friend,index)=>{
    //                 console.log(friend?.displayName?.includes(searchValue));
    //                 return friend?.displayName?.includes(searchValue);
    //             });
    //             dispatch(getListFriends(data));
    //         }else{
    //             (async()=>{
    //                 const sub = firestore().collection('users').onSnapshot(querySnapshot => {
    //                     const list = [];
    //                     querySnapshot.forEach(async doc => {
    //                       const { displayName, email, phoneNumber, photoURL, status, friends, token,requestFriend, sentRequestFriend } = doc.data();
    //                       await user?.friends?.forEach(friend => {
    //                         if (friend === doc.id) {
    //                           list.push({
    //                             uid: doc.id,
    //                             email: email,
    //                             displayName: displayName,
    //                             phoneNumber: phoneNumber,
    //                             photoURL: photoURL,
    //                             status: status,
    //                             friends: friends,
    //                             token: token,
    //                             requestFriend,
    //                             sentRequestFriend
    //                           });
    //                         }
    //                       });
    //                     });
    //                     dispatch(getListFriends(list));
    //                 });
    //                 console.log('sub',sub);
    //                 return ()=>sub();
    //             })()
    //         }
    //     },250);
    //     console.log(timeout);
    //     return ()=> {
    //         clearTimeout(timeout);
    //     }
    // },[searchValue]);
    return (
        <>
            <View style={{ marginVertical: 10, borderBottomWidth: 0.5 }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, }}>
                    <View style={{ alignSelf: 'center' }}>
                        <Image source={images.icons.ic_search} style={{ width: 28, height: 28, tintColor: Colors.black, }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={{ paddingHorizontal: 10, fontSize: 16, color:Colors.black, fontFamily:'MontserratAlternates-Regular' }}
                            placeholder={'Tìm liên hệ của bạn...'}
                            placeholderTextColor={Colors.black}
                            onChangeText={(txt)=>props?.setSearchValue(txt)}
                            value={props?.searchValue}
                        />
                    </View>
                </View>
            </View>
        </>
    )
}

export default SearchComponent