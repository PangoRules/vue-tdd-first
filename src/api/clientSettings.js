import axios from "axios";

const apis = {
    serverBaseApi(){
        return axios.create({
            baseURL: process.env.VUE_APP_SERVER
        });
    }
}

export default apis;