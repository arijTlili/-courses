import React, { useId } from 'react';
import _ from 'lodash';

const TableBody = (props) =>  {
    const {data, columns } = props
    // const [counter, setCounter] = useState(0)
    const tableRowId = useId()
    const tableColId = useId()
    const renderCell = (item, column) => {
        if (column.content) return column.content(item);
        return _.get(item,column.path);
    }

    return (
        <tbody>
            {
                data.map((item, index) => {
                    let {_id} = item;
                    return (
                        <tr key={`${tableRowId}-${_id}-${index}`}>
                            {
                                columns.map((col, index) => (
                                    <td key={`${tableColId}-${_id}-${index}`}>
                                        {renderCell(item, col)}
                                    </td>
                                ))
                            }
                        </tr>
                    )
                })
            }

        </tbody>
    );
}
 
export default TableBody;

// const TableBody = (props) => {
//     const {courses, onLike, onDelete}=this.props;
//     return (
//         <tbody>
//         {courses.map( course => (
//         <tr key= {course._id}>
//             <td>{course.title}</td>
//             <td>{course.field.name}</td>
//             <td>{course.numberOfHours}</td>
//             <td>{course.dailyRentalRate}</td>
//             <td>
//                 <Like liked={course.liked} onClick={() =>onLike(course)} /> 
//                 {/* liked and the event onclick are the inputs of the component like */}
//             </td>
//             <td> <button
//                     onClick={() =>onDelete(course)} 
//                     className="btn btn-danger btn-sm">
//                         Delete
//                 </button>
//             </td>
//         </tr>
//         ))}
//     </tbody>        
//     );
//         }
 
// export default TableBody;