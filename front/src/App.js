import React, { Component } from 'react';
import NavBar from './components/navbar';
import Routing from './navigation copy/routing';
import {ToastContainer} from 'react-toastify';
import auth from './services/authService';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';


class App extends Component {
  state = {} ;

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({user});
  }

  render() { 
    const {user} = this.state; 
    return (
    <React.Fragment>
      <ToastContainer/>
      <NavBar user={user}/>
      <main className='container'>
       <Routing user={user}/>
      </main>
    </React.Fragment>
    );
  }
}
 
export default App;