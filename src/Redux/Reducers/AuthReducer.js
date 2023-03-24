

import * as Types from '../Constants/Auth';
const InitialState = {
    user: null,
}
const AuthReducer = (state = InitialState, action) => {
    switch (action.type) {
        case Types.SAVE_INFO_USER:
            console.log('action: ', action.payload);
            return {
                ...state,
                user: action.payload
            }
        default:
            return state
    }
}
export default AuthReducer


