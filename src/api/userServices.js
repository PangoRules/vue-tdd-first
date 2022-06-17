import apis from "./clientSettings.js";
import apiUrls from "../util/apiUrls.js";

/**
 * Services for the user part of the api
 * @author Rafael Antonio Bolanos
 */

/**
 * Function en charge of calling the api to create a new user
 * @param {<Object>(user)} userModel - Model with the data of the user to add.
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
 * @param {String} query - Pagination query to specify page and size, should be like: '?page=X&size=X'
 * @returns Response object with list of users
 */
async function getUsers(query=''){
    try{
        let response = await apis.serverBaseApi().get(`${apiUrls.USER_GET_USERS}${query}`);
        return response;
    }catch(error){
        return error.response;
    }
}

export{ createNewUser, activateUser, getUsers };