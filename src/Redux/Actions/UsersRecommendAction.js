import * as Types from '../Constants/UsersRecommend';

export const getUsersRecommend = (payload) => {
    return {
        type: Types.GET_USERS_RECOMMEND,
        payload
    }
}
