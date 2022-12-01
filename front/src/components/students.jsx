
import React, { Component } from 'react';
import {getUsers} from '../services/userService'

class Students extends Component {
    state = {
    
    } ;

    async componentDidMount () {
      const {data :users } = await getUsers();
      this.setState({users});
      console.log(users);
   
      
    }
   
    
    

    render() { 
        return (
            <ul className="list-group ">{ this.state.users.map(user =>
                <li 
                 key={user._id}
                 className="clickable list-group-item " 
                 >
                    {user.name}
                </li>
            )}
            
            </ul>
        );
    }
}

export default Students;