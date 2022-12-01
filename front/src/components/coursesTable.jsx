import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Like from "./common/like";
import Table from './common/table';
import auth from '../services/authService';


class CoursesTable extends Component {
    columns=[
        { path: "title", label: "Title", content: course => <Link to={`/courses/${course._id}`}>{course.title}</Link>},
        { path: "field.name", label: "Field"},
        { path: "numberOfHours", label: "Hours"},
        { path: "dailyRentalRate", label: "Rate"},
        {key: "like", 
         content: course =>(
         <Like liked={course.liked} onClick={() =>this.props.onLike(course)} />
          )
        }
    ]
    
    deleteColumn = {
        key: "delete",
        content: course => (
            <button
                onClick={() =>this.props.onDelete(course)} 
                className="btn btn-danger btn-sm">
                    Delete
        </button>
        )
   };

    constructor () {
        super();
        const user = auth.getCurrentUser();
        if (user && user.isAdmin)
            this.columns.push(this.deleteColumn);
            
    }

    render() { 
            const {courses, sortColumn, onSort}=this.props;
            return (  
                <Table 
                    columns={this.columns}
                    data={courses}
                    sortColumn={sortColumn}
                    onSort={onSort}
                     />
                
                         
            );
    }
}

 
export default CoursesTable;