import { message } from "antd";
import axios from "axios";

const deletefilm = async (id) => {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=20f8bd72&s=${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

const loadCategories = async () => {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/categories`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting film:', error);
        return null;
    }
}


const createFilm = async (model) => {
    try {
        const res = await axios.post(`https://fakestoreapi.com/products`, model);
        return res.data;
    } catch (error) {
        console.error('Error deleting film:', error);
        return null;
    }
}

export { deletefilm,createFilm,loadCategories}