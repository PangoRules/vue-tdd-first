import { createStore } from 'vuex';
import storage from './storage';

const store = createStore({
	state(){
		return JSON.parse(localStorage.getItem("auth"));
	},
	mutations:{
		loginSuccess(state, userData){
			state.isLoggedIn=true;
			assignStateData(userData, state);
		},
		reset(state, initialState){
			state.isLoggedIn = false;
			delete state.id;
			assignStateData(initialState, state);
		}
	},
});

store.subscribe((mutation, state) => {
	storage.setItem("auth", state);
});

export const resetAuthState = () =>{
	store.commit('reset', storage.getItem("auth"));
}

export default store;

function assignStateData(userData, state) {
	for (let key in userData) {
		state[key] = userData[key];
	}
}
