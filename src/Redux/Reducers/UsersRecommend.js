

import * as Types from '../Constants/UsersRecommend';
import firestore from '@react-native-firebase/firestore';
const InitialState = {
    usersRecommend:[]
}
const UsersRecommendReducer = (state = InitialState, action) => {
    switch (action.type) {
        case Types.GET_USERS_RECOMMEND:
            return {
                ...state,
                usersRecommend: action.payload
            }
        default:
            return state
    }
}
export default UsersRecommendReducer


