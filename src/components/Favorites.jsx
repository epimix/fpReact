import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Tag, Row, Col, Empty, message, Popconfirm, Tooltip } from 'antd';
import {
    HeartFilled,
    StarFilled,
    DeleteOutlined,
    PlayCircleOutlined,
    ArrowLeftOutlined,
    ClearOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { useFavorites } from '../hooks/useFavorites';
import { getPopularFilms, getLocalFilms } from '../services/film.servise';
import './Favorites.css';

const { Title, Paragraph, Text } = Typography;
const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w300';

export default function Favorites() {
    const navigate = useNavigate();
    const {
        likedFilms,
        toggleFavorite,
        clearFavorites,
        isInitialized
    } = useFavorites();
    const [favoriteFilms, setFavoriteFilms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFavoriteFilms = async () => {
            if (!isInitialized) return;

            setLoading(true);
            try {
                const likedIds = likedFilms;

                if (likedIds.length === 0) {
                    setFavoriteFilms([]);
                    setLoading(false);
                    return;
                }

                const tmdbFilms = await getPopularFilms();
                const tmdbFavorites = (tmdbFilms?.results || [])
                    .filter(film => likedIds.includes(film.id.toString()))
                    .map(film => ({
                        id: film.id,
                        poster: film.poster_path ? TMDB_IMAGE + film.poster_path : '',
                        title: film.title,
                        year: film.release_date ? film.release_date.slice(0, 4) : '',
                        rating: film.vote_average,
                        type: 'TMDB',
                        isLocal: false
                    }));

                const localFilms = getLocalFilms();
                const localFavorites = localFilms
                    .filter(film => likedIds.includes(film.id.toString()))
                    .map(film => ({
                        id: film.id,
                        poster: film.poster || '',
                        title: film.title,
                        year: film.year || '',
                        rating: film.rating || 0,
                        type: 'Local',
                        isLocal: true
                    }));

                setFavoriteFilms([...localFavorites, ...tmdbFavorites]);
            } catch (error) {
                console.error('Error loading favorite films:', error);
                message.error('Error loading favorites');
            } finally {
                setLoading(false);
            }
        };

        loadFavoriteFilms();
    }, [likedFilms, isInitialized]);

    const handleRemoveFromFavorites = (filmId) => {
        toggleFavorite(filmId);
        message.success('Removed from favorites');
    };

    const handleViewFilm = (filmId) => {
        navigate(`/film/${filmId}`);
    };

    const handleClearAllFavorites = () => {
        clearFavorites();
        message.success('All favorites cleared');
    };

    const handleRefreshFavorites = () => {
        setFavoriteFilms([...favoriteFilms]);
    };

    if (!isInitialized || loading) {
        return (
            <div className="loading-container">
                <div className="ant-spin ant-spin-lg ant-spin-spinning">
                    <span className="ant-spin-dot ant-spin-dot-spin">
                        <i className="ant-spin-dot-item"></i>
                        <i className="ant-spin-dot-item"></i>
                        <i className="ant-spin-dot-item"></i>
                        <i className="ant-spin-dot-item"></i>
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <div className="favorites-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                <div>
                    <Title level={1} className="favorites-title">
                        <HeartFilled style={{ color: '#ff6b6b' }} />
                        My Favorites
                    </Title>
                    <Paragraph className="favorites-subtitle">
                        Your personal collection of favorite films
                    </Paragraph>
                </div>
            </div>

            {favoriteFilms.length > 0 && (
                <div className="favorites-actions">


                    <Popconfirm
                        title="Clear all favorites"
                        description="Are you sure you want to remove all films from your favorites? This action cannot be undone."
                        onConfirm={handleClearAllFavorites}
                        okText="Yes, clear all"
                        cancelText="Cancel"
                        placement="topRight"
                    >
                        <Button
                            danger
                            icon={<ClearOutlined />}
                            size="large"
                        >
                            Clear All Favorites
                        </Button>
                    </Popconfirm>
                </div>
            )}

            <div className="favorites-stats">
                <Row gutter={[24, 16]} align="middle">
                    <Col xs={24} sm={8}>
                        <div className="stat-item">
                            <div className="stat-number" style={{ color: '#ff6b6b' }}>
                                {favoriteFilms.length}
                            </div>
                            <Text className="stat-label">Total Favorites</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={8}>
                        <div className="stat-item">
                            <div className="stat-number" style={{ color: '#f39c12' }}>
                                {favoriteFilms.filter(f => f.isLocal).length}
                            </div>
                            <Text className="stat-label">Local Films</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={8}>
                        <div className="stat-item">
                            <div className="stat-number" style={{ color: '#3498db' }}>
                                {favoriteFilms.filter(f => !f.isLocal).length}
                            </div>
                            <Text className="stat-label">TMDB Films</Text>
                        </div>
                    </Col>
                </Row>
            </div>

            {favoriteFilms.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div className="empty-state">
                            <div className="empty-title">No favorite films yet</div>
                            <div className="empty-description">
                                Start adding films to your favorites by clicking the heart icon on any film
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/films')}
                                style={{ height: '48px', padding: '0 32px', fontSize: '16px', fontWeight: 600 }}
                            >
                                Browse Films
                            </Button>
                        </div>
                    }
                />
            ) : (
                <div className="favorites-grid">
                    {favoriteFilms.map((film) => (
                        <div key={film.id} className="film-card">
                            <div className="film-poster">
                                <img
                                    alt={film.title}
                                    src={film.poster || '/vite.svg'}
                                />
                                {film.rating && (
                                    <div className="film-rating">
                                        <StarFilled style={{ color: '#f39c12' }} />
                                        {film.rating.toFixed(1)}
                                    </div>
                                )}
                                {film.isLocal && (
                                    <Tag color="green" className="film-tag">
                                        Your Film
                                    </Tag>
                                )}
                                <div className="film-actions">
                                    <Tooltip title="View film details">
                                        <Button
                                            type="text"
                                            icon={<PlayCircleOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewFilm(film.id);
                                            }}
                                            className="action-button"
                                        />
                                    </Tooltip>
                                    <Tooltip title="Remove from favorites">
                                        <Popconfirm
                                            title="Remove from favorites"
                                            description={`Remove "${film.title}" from your favorites?`}
                                            onConfirm={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFromFavorites(film.id);
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                            placement="topRight"
                                        >
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                onClick={(e) => e.stopPropagation()}
                                                className="action-button delete"
                                            />
                                        </Popconfirm>
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="film-info">
                                <Title level={5} className="film-title">
                                    {film.title}
                                </Title>
                                <div className="film-meta">
                                    <Paragraph className="film-year-type">
                                        {film.year} • {film.type}
                                    </Paragraph>
                                    <Tag color={film.isLocal ? 'green' : 'blue'}>
                                        {film.isLocal ? 'Local' : 'TMDB'}
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
