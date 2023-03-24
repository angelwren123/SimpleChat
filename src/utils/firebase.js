import firestore from '@react-native-firebase/firestore'
export const _AddANewUser = async (user) => {
    return await firestore()
        .collection('users')
        .doc(user.user.uid)
        .set({
            uid: user.user.uid,
            email: user.user.email,
            displayName: user?.user.email?.slice(0,-10),
            phoneNumber: null,
            photoURL: `https://cdn.onlinewebfonts.com/svg/img_569204.png`,
            friends:[],
            requestFriend:[],
            sentRequestFriend:[],
            status:'online',
            token:'',
        });
}
export const _EditUser = async (user, data) => {
    return await firestore()
        .collection('users')
        .doc(user.uid)
        .update({
            displayName: `${data.username}`,
            phoneNumber: `${data.phonenumber}`,
            photoURL: `${data.avatar}`,
        });
}