import React, { Component } from 'react';
import { getCourses , deleteCourse} from "../services/courseService"
import { getFields } from '../services/fieldService';
// import Like from "./common/like";
import Pagination from './common/pagination';
import ListGroup from './common/ListGroup';
import _ from "lodash";
import CoursesTable from './coursesTable';
// import { paginate } from '../utils/paginate';
// import { Route , Switch, Redirect} from 'react-router-dom';
import { Link } from 'react-router-dom';
import Search from './common/search';
import { toast } from 'react-toastify';



class Courses extends Component {
    state = { 
        courses : [],
        pageSize:2 ,
        currentPage:1,
        selectedField: null,
        searchQuery: '',
        fields : [] ,
        sortColumn: {path: 'title', order: 'asc'}
     } 


     async componentDidMount () {
        const {data } = await getFields();
        const fields=[{_id:"", name:"All fields of study"}, ...data]
        const {data :courses } = await getCourses();
        this.setState({courses, fields});
     }


     handleDelete = async course => {
        const originalCourses = this.state.courses;
        const courses = originalCourses.filter(c => c._id !== course._id  );
        this.setState ({courses});
        try {
            await deleteCourse(course._id);
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404)
                toast.error ('this course has already been deleted .');
            this.setState ({originalCourses});
        }
        
     }

     handleLike = course => {
        const nextCourses = this.state.courses.map(c => {
            if (c._id === course._id){
                c.liked=!c.liked;
            }
            return c;
        })
        this.setState({nextCourses});
     }

     handlePageChange = page => {
        this.setState({currentPage : page});

     }
     
     handleFieldSelect = field => {
        this.setState({selectedField : field, searchQuery: '', currentPage:1});
     }

     handleSearch = query => {
        this.setState({searchQuery: query, selectedField: null, currentPage:1 })     }
     
     handleSort = sortColumn => {
        this.setState({sortColumn});
     }

     getPageData = () => {
        const {pageSize, currentPage, courses: AllCourses,selectedField, sortColumn, searchQuery} = this.state;
        let filtred= AllCourses;
        if (this.state.searchQuery)
            filtred= AllCourses.filter(c => 
                c.title.toLowerCase().startsWith(searchQuery.toLowerCase()));
        else if (selectedField && selectedField._id)
                filtred= (AllCourses.filter(c=> c.field._id === selectedField._id )) ;

        // const filtred = selectedField && selectedField._id
        //     ? (AllCourses.filter(m=> m.field._id=== selectedField._id )) 
        //     : (AllCourses)

        const sorted = _.orderBy(filtred, [sortColumn.path], [sortColumn.order]) //retourne un array trier

        const startIndex= ( currentPage-1 )* pageSize;

        const courses = sorted.slice(startIndex, startIndex+pageSize);
        return { totalCount: filtred.length , data: courses };
     }


    render() { 
        const {length: count} = this.state.courses;
        const {pageSize, currentPage, sortColumn, searchQuery} = this.state;
        const {user}= this.props;

        if (count === 0)
            return <p> There are no courses in the database. </p>;

        const { totalCount, data: courses }= this.getPageData();
        // console.log(courses)
        return (
                <div className="container ">
                    <div className='row '>
                        <div className="col-4">
                            <ListGroup
                                items= {this.state.fields}
                                selectedItem={this.state.selectedField}
                                onItemSelect={this.handleFieldSelect} />
                        </div>
                        <div className="col">
                            {user && 
                            <Link to="/courses/new" className="btn btn-primary" style={{ marginBottom: 20 }} >New Course</Link>}
                            <p className='m-2'> Showing {totalCount} courses in the database .</p>
                            <Search 
                                value={searchQuery}
                                onChange={this.handleSearch} />
                            <CoursesTable 
                                courses={courses}
                                onLike={this.handleLike}
                                onDelete={this.handleDelete}
                                onSort={this.handleSort}
                                sortColumn={sortColumn} />
                            <Pagination 
                                currentPage={currentPage}
                                itemsCount={totalCount} 
                                pageSize={pageSize} 
                                onPageChange={this.handlePageChange} 
                            />  
                    
                        </div>
                    </div>
                </div>
           
            
              
        );
    }
}
 
export default Courses;