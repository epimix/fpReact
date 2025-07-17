import axios from "axios";

const TMDB_API_KEY = "0abc241c94568df35e0fe4b4ba26785a";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const LOCAL_FILMS_KEY = "local_films";

const getPopularFilms = async (page = 1) => {
    try {
        const res = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US",
                page,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting popular films:", error);
        return null;
    }
};

const searchFilms = async (query, page = 1) => {
    try {
        const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US",
                query,
                page,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error searching films:", error);
        return null;
    }
};

const getFilmById = async (id) => {
    try {
        const res = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting film by ID:", error);
        return null;
    }
};

const getLocalFilms = () => {
    const data = localStorage.getItem(LOCAL_FILMS_KEY);
    return data ? JSON.parse(data) : [];
};

const saveLocalFilms = (films) => {
    localStorage.setItem(LOCAL_FILMS_KEY, JSON.stringify(films));
};

const createFilm = (film) => {
    const films = getLocalFilms();
    film.id = Date.now();
    films.push(film);
    saveLocalFilms(films);
    return film;
};

const editFilm = (film) => {
    const films = getLocalFilms();
    const idx = films.findIndex((f) => Number(f.id) === Number(film.id));
    if (idx !== -1) {
        films[idx] = film;
        saveLocalFilms(films);
        return film;
    }
    return null;
};

const deleteFilm = (id) => {
    let films = getLocalFilms();
    films = films.filter((f) => f.id !== id);
    saveLocalFilms(films);
    return true;
};

export {
    getPopularFilms,
    searchFilms,
    getFilmById,
    getLocalFilms,
    createFilm,
    editFilm,
    deleteFilm,
};