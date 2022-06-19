import apis from "./clientSettings.js";
import apiUrls from "../util/apiUrls.js";

/**
 * Services for the user part of the api
 * @author Rafael Antonio Bolanos
 */

/**
 * Function en charge of calling the api to create a new user
 * @param {<Object>} userModel - Model with the data of the user to add.
 * @returns Response object with the result of the call
 */
async function createNewUser(userModel){
    try{
        let response = await apis.serverBaseApi().post(apiUrls.USER_CREATE, userModel);
        return response;
    }catch(error){
        return error.response;
    }
}

/**
 * Function in charge of activating an account from token
 * @param {String} token Jwt Received in activation page for account activation
 * @returns response from server
 */
async function activateUser(token){
    try{
        let response = await apis.serverBaseApi().post(`${apiUrls.USER_ACTIVATE}${token}`);
        return response;
    }catch(error){
        return error.response;
    }
}

/**
 * Function to return list of users
 * @param {Number} page - Number of the page to get users from
 * @param {Number} size - Amount of users to get
 * @returns Response object with list of users
 */
async function getUsers(page=0, size=3){
	try{
		let response = await apis.serverBaseApi().get(apiUrls.USER_GET_USERS,
				{
						params:{page: page, size: size}
				}
		);
		return response;
	}catch(error){
		return error.response;
	}
}

/**
 * Function that querys an user depending on it's id
 * @param {Number} id Id of the user to query
 * @returns Response object with user data
 */
async function getUser(id){
	try{
		let response = await apis.serverBaseApi().get(`${apiUrls.USER_GET_USER}${id}`);
		return response;
	}catch(error){
		return error.response;
	}
}

/**
 * Function in charge of loggin in an user
 * @param {<Object>} userModel - Model with the data of the user to login. 
 * @returns Response object with data of the logged in user
 */
async function userLogin(userModel){
	try{
		let response = await apis.serverBaseApi().post(apiUrls.USER_LOGIN,userModel);
		return response;
	}catch(error){
		return error.response;
	}
}

export{ createNewUser, activateUser, getUsers, getUser, userLogin };