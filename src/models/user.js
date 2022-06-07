export default class User{
    /**
     * Parameters for an user
     * @param {String} username 
     * @param {Email} email 
     * @param {String} password 
     */
    constructor(
        username,
        email,
        password
    ){
        this.username = username ? username : "";
        this.email = email ? email : "";
        this.password = password ? password : "";
    }
}