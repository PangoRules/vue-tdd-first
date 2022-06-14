import axios from "axios";
import i18n from '../locales/i18n.js';

const apis = {
    serverBaseApi(){
        return axios.create({
            baseURL: process.env.VUE_APP_SERVER,
            headers:{
                "Accept-Language": i18n.global.locale
            }
        });
    }
}

export default apis;