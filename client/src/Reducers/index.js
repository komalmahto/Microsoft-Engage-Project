import { combineReducers } from 'redux';
import user from './userReducer';
import chat from './chatReducer';

const rootReducer = combineReducers({
    user,
    chat
});

export default rootReducer;