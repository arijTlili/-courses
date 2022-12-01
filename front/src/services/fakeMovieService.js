import * as genresAPI from "./fakeGenreService"

const movies = [
    {
        _id :"100255", //default name of the id column in mongodb
        title : "movie1",
        genre : { _id: "id-action", name: "action"},
        numberInStock: 6,
        dailyRentalRate: 2.5,
        publishDate: "01-02-2018",
       

    },
    {
        _id :"254842",
        title : "movie2",
        genre : { _id: "id-comedy", name: "comedy"},
        numberInStock: 5,
        dailyRentalRate: 3.5,
        publishDate: "02-02-2018"

    },
    {
        _id :"300255",
        title : "movie3",
        genre : { _id: "id-comedy", name: "comedy"},
        numberInStock: 3,
        dailyRentalRate:3,
        publishDate: "03-02-2018"

    },
    {
        _id :"405145",
        title : "movie4",
        genre : { _id: "id-thriller", name: "thriller"},
        numberInStock: 8,
        dailyRentalRate: 3.5,
        publishDate: "04-02-2018"

    },
    {
        _id :"585220",
        title : "movie5",
        genre : { _id: "id-action", name: "action"},
        numberInStock: 7,
        dailyRentalRate: 1.5,
        publishDate: "05-02-2018"

    },
    {
        _id :"6441215",
        title : "movie6",
        genre : { _id: "id-thriller", name: "thriller"},
        numberInStock: 12,
        dailyRentalRate: 4.5,
        publishDate: "06-02-2018"

    },
];

export function getMovies(){
    return movies;
}

export function getMovie(id){
    return movies.find(m => m._id === id );
}

export function saveMovie(movie){
    let movieInDb = movies.find(m => m._id === movie._id ) || {};
    movieInDb.title = movie.title;
    movieInDb.genre = genresAPI.genres.find(g => g._id === movie.genreId);
    movieInDb.numberInStock= movie.numberInStock;
    movieInDb.dailyRentalRate= movie.dailyRentalRate;

    if( !movieInDb._id) {
        movieInDb._id = Date.now().toString();
        movies.push(movieInDb);
    }
    return movieInDb;
}