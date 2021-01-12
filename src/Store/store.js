import { createStore,compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../Reducers';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loggerMiddleware = createLogger();

export const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(thunkMiddleware,loggerMiddleware))
);

export default store;