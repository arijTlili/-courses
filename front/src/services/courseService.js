import http from "./httpService";
import config from "../config.json"
import * as fieldsAPI from "./fieldService"

const apiEndpoint = config.apiURL+'/courses';

function courseURL(id) {
    return `${apiEndpoint}/${id}`;
}

export function getCourses(){
    return http.get (apiEndpoint );
}

export function deleteCourse(courseId){
    return http.delete (courseURL(courseId));
}

export function getCourse(courseId){
    return http.get (courseURL(courseId));
}

export function saveCourse(course){
 
    if (course._id ){
        console.log(course);
        const body = {...course};
        delete body._id;
        return http.put(courseURL(course._id), body); // updating a course
    }
    
    return http.post(apiEndpoint, course);  //creating a course
}