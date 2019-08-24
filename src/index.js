import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";
import { CookiesProvider } from 'react-cookie';

import App from './App';
import * as serviceWorker from './serviceWorker';
import rootReducer from "./reducers";
import rootSaga from "./sagas";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import './css/bootstrap.theme.lux_v4.css';
import './css/index.css';

const sagaMiddleware = createSagaMiddleware();
let middlewares = applyMiddleware(sagaMiddleware);

// const reduxDevTools =
// 	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

let store = createStore(
	rootReducer,
	compose(middlewares)
);

sagaMiddleware.run(rootSaga);

console.log('Index -> lets render()');
ReactDOM.render(
	<CookiesProvider>
		<Provider store={store}>
			<App />
		</Provider>
	</CookiesProvider>,

	document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
