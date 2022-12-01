import Axios from "axios";
import {toast} from 'react-toastify';
import logger from "./logService"




Axios.interceptors.response.use(null, error => {
  const expectedError= 
    error.response && 
    error.response.status >=400 && 
    error.response<500;
  if (!expectedError){
    logger.log(error);
    toast.error("an unexpected error occured.");
  }
  
  return Promise.reject(error);
})

function setJwt(jwt) {
  Axios.defaults.headers.common['x-auth-token'] = jwt //to include this header on any request
}

export default {
  get: Axios.get,
  post: Axios.post,
  delete: Axios.delete,
  put: Axios.put,
  patch: Axios.patch,
  setJwt
}
