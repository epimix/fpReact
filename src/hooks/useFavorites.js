import { useContext, useCallback } from 'react';
import { likeContext } from '../contexts/likeContext';

export const useFavorites = () => {
    const context = useContext(likeContext);

    if (!context) {
        throw new Error('useFavorites must be used within a LikeContextProvider');
    }

    const {
        likedFilms,
        toggleLike,
        isLiked,
        getLikedCount,
        clearAllLikes,
        addMultipleLikes,
        removeMultipleLikes,
        isInitialized
    } = context;

    const toggleFavorite = useCallback((filmId) => {
        toggleLike(filmId);
    }, [toggleLike]);

    const isFavorite = useCallback((filmId) => {
        return isLiked(filmId);
    }, [isLiked]);

    const getFavoritesCount = useCallback(() => {
        return getLikedCount();
    }, [getLikedCount]);

    const clearFavorites = useCallback(() => {
        clearAllLikes();
    }, [clearAllLikes]);

    const addMultipleFavorites = useCallback((filmIds) => {
        addMultipleLikes(filmIds);
    }, [addMultipleLikes]);

    const removeMultipleFavorites = useCallback((filmIds) => {
        removeMultipleLikes(filmIds);
    }, [removeMultipleLikes]);

    return {
        likedFilms,
        isInitialized,
        toggleFavorite,
        clearFavorites,
        addMultipleFavorites,
        removeMultipleFavorites,
        isFavorite,
        getFavoritesCount
    };
};
