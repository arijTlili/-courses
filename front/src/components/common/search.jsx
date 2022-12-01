import React, { Component } from 'react';

const Search = ({value, onChange}) => {
    return ( 
        <input

            type="text"
            name='query'
            className='form-control my-3 table-secondary'
            placeholder="Serach..."
            value={value} 
            onChange={e => onChange(e.currentTarget.value)} />
        // <div className="form-outline">
        //     <input list="datalistOptions"  className="form-control" placeholder="Serach..." style={{ marginBottom: 15 }} />
        //     <datalist id="datalistOptions">{courses.map(course  => (
        //         <option key={course._id} value={course.title}/>
        //     ))}
                
        //     </datalist>
        // </div>
     );
}
 
export default Search;