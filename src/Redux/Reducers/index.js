
import { combineReducers } from 'redux';
import UsersRecommendReducer from './UsersRecommend';
import AuthReducer from './AuthReducer';
import ListFriendsReducer from './ListFriendsReducer';
const rootReducer = combineReducers({
    AuthReducer,
    UsersRecommendReducer,
    ListFriendsReducer
});
export default rootReducer;