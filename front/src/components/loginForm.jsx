import React, { Component } from 'react';
import Joi  from 'joi-browser';
import Form from './common/form';
import { Redirect } from 'react-router-dom';
import auth from "../services/authService";



class LoginForm extends Form {

    state={
        data: { username: '', password: '' },
        errors: {}
    }

    // username= React.createRef(); //create a ref object

    // componentDidMount() {
    //     this.username.current.focus(); //pour mettre le curseur sur l'input username automatiquement ou bien on utilise l'attribut autoFocus dans l'input de username
    // }

    schema = {
        username: Joi.string().required().label('Username'),
        password: Joi.string().required().label('Password'),
    }

    
   

    doSubmit =async () => {
        //call the server
        // const username= this.username.current.value; // current retourne the actuel dom element
        // console.log(username);
        try {
            const {data}= this.state;
            await auth.login(data.username,data.password);
            // this.props.history.push('/'); //to redirect the page to the home page
            // window.location = "/"; //to reload and redirect the page
            const {state} = this.props.location;
            window.location = state ? state.from.pathname : "/" ;
        }
        catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = {...this.state.errors};
                errors.username= ex.response.data;
                this.setState({errors});
            }
        }
    }
    

    render() { 
        if (auth.getCurrentUser()) return <Redirect to="/" />;
       
        return (
            <div>
                <h1>Login</h1>
                 <form 
                    onSubmit={this.handleSubmit}>
                    {this.renderInput('username','Username')}
                    {this.renderInput('password','Password', 'password' )}
                    {this.renderButton('Login')}
                 </form>
            </div>
        );
    }
}
 
export default LoginForm;