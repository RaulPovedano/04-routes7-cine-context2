const VITE_API_TOKEN = import.meta.env.VITE_API_TOKEN;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_BASE_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;


// objeto que me permite decidir el tamaño de las imagenes
export const IMAGES_SIZES ={
    POSTER: "w500",
    BACKDROP: "original",
}


//------FUNCIONES QUE VOY A CREAR PARA LA API----
// funcion para obtener la url de una imagen
//paso un path : /blablabla
export const getImageUrl = (path, size = IMAGES_SIZES.POSTER) =>{
    if(!path) return "/placeholder-movie.jpg";
    return `${VITE_BASE_IMAGE_URL}/${size}${path}`
}

const fetchFromApi = async (endpoint, options={}) =>{
    try {
        const response = await fetch(`${VITE_BASE_URL}/${endpoint}?api_key=${VITE_API_TOKEN}&language=es-ES&${new URLSearchParams(options)}`)

        if(!response){
            throw new Error('Error en la peticion')
        }

        return await response.json()
    } catch (error) {
        throw new Error("Error en la peticion: ", error)
    }

   
}

 // funcion para peliculas populares

 export const getPopularMovies = async (page=1) =>{
    return fetchFromApi("movie/popular", {page})
 }

 //detalles de las peliculas

 export const getMovieDetails = async (id) => {
    return fetchFromApi(`movie/${id}`)
}

 //buscar peliculas

 export const searchMovies = async (query, page = 1) => {
     return fetchFromApi('search/movie', { query, page });
 };
 //mostrar video de pelicula
 
 export const getMovieVideos = async (id) =>{
    return fetchFromApi(`movie/${id}/videos`)
 }


// Remove the getMovieById function as we're using getMovieDetails
export const getMovieById = async (id) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`
        }
    };

    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=es-ES`, options);
    if (!response.ok) {
        throw new Error('Error al obtener los detalles de la película');
    }
    return response.json();
};