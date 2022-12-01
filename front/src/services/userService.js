import http from "./httpService";
import config from "../config.json"

const apiEndpoint = config.apiURL+'/users';

export function register(user) {
    return http.post(apiEndpoint, {
        email: user.username,
        password: user.password,
        name: user.name
    });
}
    
export function getUsers() {
    return http.get(apiEndpoint);
    };
