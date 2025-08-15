import { createContext, useState, useEffect, useCallback } from "react";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';

const initialState = {
    likedFilms: [],
    toggleLike: () => { },
    isLiked: () => false,
    getLikedCount: () => 0,
    clearAllLikes: () => { },
    addMultipleLikes: () => { },
    removeMultipleLikes: () => { }
};

export const likeContext = createContext(initialState);

export const LikeContextProvider = ({ children }) => {
    const [likedFilms, setLikedFilms] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const savedLikedFilms = getStorageItem(STORAGE_KEYS.LIKED_FILMS, []);
            if (Array.isArray(savedLikedFilms)) {
                setLikedFilms(savedLikedFilms);
            }
        } catch (error) {
            console.error('Error loading liked films:', error);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (isInitialized) {
            setStorageItem(STORAGE_KEYS.LIKED_FILMS, likedFilms);
        }
    }, [likedFilms, isInitialized]);

    const toggleLike = useCallback((filmId) => {
        const filmIdStr = String(filmId);
        setLikedFilms(prev => {
            const isCurrentlyLiked = prev.includes(filmIdStr);
            return isCurrentlyLiked
                ? prev.filter(id => id !== filmIdStr)
                : [...prev, filmIdStr];
        });
    }, []);

    const isLiked = useCallback((filmId) => {
        const filmIdStr = String(filmId);
        return likedFilms.includes(filmIdStr);
    }, [likedFilms]);

    const getLikedCount = useCallback(() => {
        return likedFilms.length;
    }, [likedFilms]);

    const clearAllLikes = useCallback(() => {
        setLikedFilms([]);
    }, []);

    const addMultipleLikes = useCallback((filmIds) => {
        const newIds = filmIds.map(id => String(id)).filter(id => !likedFilms.includes(id));
        if (newIds.length > 0) {
            setLikedFilms(prev => [...prev, ...newIds]);
        }
    }, [likedFilms]);

    const removeMultipleLikes = useCallback((filmIds) => {
        const idsToRemove = filmIds.map(id => String(id));
        setLikedFilms(prev => prev.filter(id => !idsToRemove.includes(id)));
    }, []);

    const value = {
        likedFilms,
        toggleLike,
        isLiked,
        getLikedCount,
        clearAllLikes,
        addMultipleLikes,
        removeMultipleLikes,
        isInitialized
    };

    return (
        <likeContext.Provider value={value}>
            {children}
        </likeContext.Provider>
    );
};