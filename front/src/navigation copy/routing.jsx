import React, { Component } from 'react';
import { Route , Switch, Redirect} from 'react-router-dom';
import Courses from '../components/courses';
import Students from '../components/students';
import Rentals from '../components/rentals';
import NotFound from './notfound';
import CourseForm from "../components/courseForm";
import LoginForm from '../components/loginForm';
import Logout from './logout';
import RegisterForm from "../components/registerForm";
import ProtectedRoute from "../components/common/protectedRoute";



const Routing = ({user}) => {
    return ( 
        <Switch>
        <Route path="/register" component={RegisterForm} />
        <Route path="/login" component={LoginForm} />
        <Route path="/logout" component={Logout} />
        <ProtectedRoute
          path="/courses/:id" 
          component={CourseForm}/>
        <Route 
          path="/courses" 
          render={props => <Courses {...props} user={user} />} />
        <Route path="/students" component={Students} />
        <Route path="/rentals" component={Rentals} />
        <Route path="/not-found" component={NotFound} />
        <Redirect from= "/" exact to="/courses"/>
        <Redirect  to="/not-found"/>
      </Switch>
     );
}
 
export default Routing;