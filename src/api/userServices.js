import apis from "./clientSettings.js";
import apiUrls from "../util/apiUrls.js";

/**
 * Services for the user part of the api
 * @author Rafael Antonio Bolanos
 */

export default{
    /**
     * Function en charge of calling the api to create a new user
     * @param {<Object>(user)} userModel - Model with the data of the user to add.
     * @returns Response object with the result of the call
     */
    async createNewUser(userModel){
        try{
            let response = await apis.serverBaseApi().post(apiUrls.USER_CREATE, userModel);
            return response;
        }catch(error){
            return error;
        }
    }
}