import * as Types from '../Constants/Auth';

export const actSaveInfoUser = (payload) => {
    return {
        type: Types.SAVE_INFO_USER,
        payload
    }
}
