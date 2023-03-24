

import * as Types from '../Constants/ListFriends';
import firestore from '@react-native-firebase/firestore';
const InitialState = {
	listFriends: [],
	listFriendsSearch:[]
}


const ListFriendsReducer = (state = InitialState, action) => {
	switch (action.type) {
		case Types.GET_LIST_FRIEND:
			// console.log(action.payload);
			const clonedList = [...action.payload];
			return {
				...state,
				listFriends: [...clonedList]
			};
			case Types.GET_LIST_FRIEND_SEARCH:
			// console.log(action.payload);
			const clonedListSearch = [...action.payload];
			return {
				...state,
				listFriendsSearch: [...clonedListSearch]
			};
		case Types.RESET_LIST_FRIEND:
			// const users = firestore().collection('users')
			return {
				...state,
				listFriends: []
			};
		default:
			return state
	}
}
export default ListFriendsReducer


