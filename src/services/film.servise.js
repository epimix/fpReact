import { message } from "antd";

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

export { deletefilm }