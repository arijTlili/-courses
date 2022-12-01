import http from "./httpService";
import config from "../config.json"

const {apiURL}= config;
export function getFields(){
    return http.get(apiURL+'/fields');
}
