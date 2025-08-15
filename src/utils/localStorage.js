const STORAGE_KEYS = {
    LIKED_FILMS: 'likedFilms',
};

export const getStorageItem = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        if (item === null) {
            return defaultValue;
        }
        return JSON.parse(item);
    } catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error);
        return defaultValue;
    }
};

export const setStorageItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
        return false;
    }
};

export { STORAGE_KEYS };
