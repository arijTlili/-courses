import React, { Component } from 'react';
import Form from './common/form';
import Joi  from 'joi-browser';
import { getCourse, saveCourse } from '../services/courseService';
import { getFields } from '../services/fieldService';

class courseForm extends Form {
    state={
        data: { 
            title: '', 
            fieldId: '',
            numberOfHours:'' ,
            dailyRentalRate: ''
         },
        fields: [],
        errors: {}
    }

    schema = {
        _id: Joi.string(),
        title: Joi.string().required().label('Title'),
        fieldId: Joi.string().required().label('Field'),
        numberOfHours: Joi.number().required().integer().min(0).max(100).label('Number of Hours'),
        dailyRentalRate: Joi.number().required().min(0).max(10).label('Number of Hours'),
    }

    async populateFields() {
        const {data:fields} = await getFields();
        this.setState({fields});
    }

    async populateCourse() {
        try {
            const courseId = this.props.match.params.id;
            if (courseId === "new") return;

            const {data: course} = await getCourse(courseId);
            this.setState({data: this.mapToViewModel(course)});
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404 )
                this.props.history.replace('/not-found');
        }
        
    }

    async componentDidMount () {
        await this.populateFields();
        await this.populateCourse();
    }

    mapToViewModel (course) {
        return{
            _id: course._id,
            title: course.title,
            fieldId: course.field._id,
            numberOfHours: course.numberOfHours,
            dailyRentalRate: course.dailyRentalRate
        }
    }

    doSubmit = async () => {
        //call the server
       await saveCourse(this.state.data);

       this.props.history.push("/courses"); //to redirect the page to "/courses"
    }

    render() { 
        return (
            <div>
                <h1>Course Form </h1>
                 <form 
                    onSubmit={this.handleSubmit}>
                    {this.renderInput('title','Title')}
                    {this.renderSelect("fieldId", "Field", this.state.fields)}
                    {/* <label for="field" >Field</label>
                    <select id="field" class="form-control">
                        <option>Action</option>
                        <option>Comedy</option>
                        <option>Thriller</option>
                    </select> */}
                    {this.renderInput('numberOfHours','Number of Hours', "number")}
                    {this.renderInput('dailyRentalRate','Rate')}
                    {this.renderButton('Save')}
                    
                    
                 </form>
            </div>
        );
    }
}
 
export default courseForm;

// const CourseForm = ({match, history}) => {
//     return ( 
//         <div>
//             <h1>Course Form {match.params.id}</h1>
//             <button className='btn btn-primary' onClick={() => history.push('/courses')} >Save</button>
//         </div>
//      );
// }
 
// export default CourseForm;
