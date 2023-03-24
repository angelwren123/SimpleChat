import * as Types from '../Constants/ListFriends';

export const getListFriends = (payload) => {
    return {
        type: Types.GET_LIST_FRIEND,
        payload
    }
}
export const getListFriendsSearch = (payload) => {
    return {
        type: Types.GET_LIST_FRIEND_SEARCH,
        payload
    }
}
export const getMessageOfListFriends = (payload) => {
    return {
        type: Types.GET_MESSAGE_OF_LIST_FRIEND,
        payload
    }
}
export const resetListFriend = () => {
    return {
        type: Types.RESET_LIST_FRIEND,
    }
}
