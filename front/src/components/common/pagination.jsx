// import React, { Component } from 'react';
// import _ from "loadash";
import PropTypes from 'prop-types';


const Pagination = ({itemsCount, pageSize, onPageChange, currentPage }) => {

    

    const pagesCount = Math.ceil( itemsCount / pageSize ); //math.ceil retoirne le plus proche entier 
    if ( pagesCount === 1 ) return null;
    // il faut creer un tab contenant les numeros des pages : [1... pagesCount]
    const pages=[]; //_.rage(1, pageCount +1) creer un tab de la forme [1... pagesCount]
    for (let i=1 ;i< pagesCount+1; i++){
        pages.push(i);
    }
    

    return ( 
        <nav>
            <ul className="pagination">
                {pages.map(page => 
                    <li key={page} className={ page=== currentPage ? "page-item active" : "page-item"}>
                        <a  
                        onClick={() => onPageChange(page)} 
                        className="page-link">{page}</a>
                    </li>
                    )}
            </ul>
        </nav>
     );
}
 
Pagination.propTypes = {
    itemsCount: PropTypes.number.isRequired, 
    pageSize: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
}

export default Pagination;
