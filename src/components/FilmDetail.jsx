import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Typography,
    Button,
    Tag,
    Spin,
    Row,
    Col,
    Divider,
    Space,
    message
} from 'antd';
import {
    PlayCircleOutlined,
    HeartFilled,
    StarFilled,
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { getPopularFilms, getLocalFilms, searchFilms, getFilmTrailers } from '../services/film.servise';
import { likeContext } from '../contexts/likeContext';

const { Title, Paragraph, Text } = Typography;
const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/original';

export default function FilmDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [film, setFilm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedFilms, setRelatedFilms] = useState([]);
    const [trailers, setTrailers] = useState([]);
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const { toggleLike, isLiked } = useContext(likeContext);

    useEffect(() => {
        const fetchFilm = async () => {
            setLoading(true);
            try {
                let localFilms = getLocalFilms();
                let foundFilm = localFilms.find(f => f.id === parseInt(id));

                if (!foundFilm) {
                    const tmdbFilms = await getPopularFilms();
                    foundFilm = tmdbFilms?.results?.find(f => f.id === parseInt(id));

                    if (foundFilm) {
                        foundFilm = {
                            id: foundFilm.id,
                            poster: foundFilm.poster_path ? TMDB_IMAGE + foundFilm.poster_path : '',
                            backdrop: foundFilm.backdrop_path ? TMDB_BACKDROP + foundFilm.backdrop_path : '',
                            title: foundFilm.title,
                            year: foundFilm.release_date ? foundFilm.release_date.slice(0, 4) : '',
                            description: foundFilm.overview,
                            rating: foundFilm.vote_average,
                            genre: foundFilm.genre_ids || [],
                            type: 'TMDB',
                            isLocal: false,
                            runtime: foundFilm.runtime || 120,
                            director: 'Unknown Director'
                        };
                    }
                } else {
                    foundFilm = {
                        ...foundFilm,
                        type: 'Local',
                        isLocal: true,
                        backdrop: foundFilm.backdrop || foundFilm.poster,
                        description: foundFilm.description || 'No description available',
                        genre: foundFilm.genre ? [foundFilm.genre] : ['Unknown'],
                        runtime: foundFilm.runtime || 120,
                        director: foundFilm.director || 'Unknown Director'
                    };
                }

                if (foundFilm) {
                    setFilm(foundFilm);
                    await loadRelatedFilms(foundFilm);
                } else {
                    message.error('Film not found');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching film:', error);
                message.error('Error loading film');
            } finally {
                setLoading(false);
            }
        };

        fetchFilm();
    }, [id, navigate]);

    useEffect(() => {
        const loadTrailers = async () => {
            if (film && !film.isLocal) {
                try {
                    const trailerData = await getFilmTrailers(film.id);
                    if (trailerData?.results) {
                        const youtubeTrailers = trailerData.results.filter(
                            video => video.site === 'YouTube' && video.type === 'Trailer'
                        );
                        setTrailers(youtubeTrailers);
                    }
                } catch (error) {
                    console.error('Error loading trailers:', error);
                }
            }
        };

        loadTrailers();
    }, [film]);




    const loadRelatedFilms = async (currentFilm) => {
        try {
            if (currentFilm.isLocal) {
                const localFilms = getLocalFilms().filter(f => f.id !== currentFilm.id);
                setRelatedFilms(localFilms.slice(0, 6));
            } else {
                const tmdbFilms = await getPopularFilms();
                const films = (tmdbFilms?.results || [])
                    .filter(f => f.id !== currentFilm.id)
                    .slice(0, 6)
                    .map(item => ({
                        id: item.id,
                        poster: item.poster_path ? TMDB_IMAGE + item.poster_path : '',
                        title: item.title,
                        year: item.release_date ? item.release_date.slice(0, 4) : '',
                        rating: item.vote_average,
                        type: 'TMDB',
                        isLocal: false
                    }));
                setRelatedFilms(films);
            }
        } catch (error) {
            console.error('Error loading related films:', error);
        }
    };

    const handleLikeToggle = () => {
        if (film) {
            toggleLike(film.id);
            message.success(
                isLiked(film.id)
                    ? `${film.title} removed from favorites`
                    : `${film.title} added to favorites`
            );
        }
    };

    const handleBookTicket = () => {
        if (showtimes.length === 0) {
            message.info('No showtimes available for this film. Please check the Showtimes page.');
            return;
        }

        const availableShowtime = showtimes.find(s => s.availableSeats > 0) || showtimes[0];
        setSelectedShowtime(availableShowtime);
        setBookingModalVisible(true);
    };

    const handleWatchTrailer = () => {
        if (trailers.length > 0) {
            setShowTrailerModal(true);
        } else {
            message.info('No trailers available for this film');
        }
    };

    const handleBookingSuccess = (booking) => {
        setBookingModalVisible(false);
        setSelectedShowtime(null);
        message.success(`Ticket booked successfully! You can view your booking in the Showtimes page.`);
    };

    const handleCloseBookingModal = () => {
        setBookingModalVisible(false);
        setSelectedShowtime(null);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!film) {
        return null;
    }

    return (
        <div className="fade-in-up" style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: '24px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                Back
            </Button>

            <div style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: '48px',
                minHeight: '500px',
                background: film.backdrop
                    ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${film.backdrop})`
                    : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                padding: '48px'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)'
                }} />

                <Row gutter={[48, 24]} style={{ position: 'relative', zIndex: 2, width: '100%' }}>
                    <Col xs={24} md={8}>
                        <Card
                            cover={
                                <img
                                    alt={film.title}
                                    src={film.poster || '/vite.svg'}
                                    style={{
                                        height: 400,
                                        width: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '16px'
                                    }}
                                />
                            }
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px'
                            }}
                            bodyStyle={{ padding: 0 }}
                        />
                    </Col>

                    <Col xs={24} md={16}>
                        <div style={{ color: 'white' }}>
                            <Title level={1} style={{
                                color: 'white',
                                marginBottom: '16px',
                                fontSize: '3rem',
                                fontWeight: 800,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                            }}>
                                {film.title}
                            </Title>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '24px',
                                flexWrap: 'wrap'
                            }}>
                                {film.rating && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'rgba(255, 193, 7, 0.2)',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(255, 193, 7, 0.3)'
                                    }}>
                                        <StarFilled style={{ color: '#FFC107' }} />
                                        <Text strong style={{ color: 'white' }}>
                                            {film.rating.toFixed(1)}
                                        </Text>
                                    </div>
                                )}

                                {film.year && (
                                    <Tag color="blue" style={{
                                        fontSize: '14px',
                                        padding: '8px 16px',
                                        borderRadius: '20px'
                                    }}>
                                        <CalendarOutlined /> {film.year}
                                    </Tag>
                                )}

                                <Tag color="purple" style={{
                                    fontSize: '14px',
                                    padding: '8px 16px',
                                    borderRadius: '20px'
                                }}>
                                    <ClockCircleOutlined /> {film.runtime} min
                                </Tag>

                                <Tag color={film.isLocal ? 'green' : 'orange'} style={{
                                    fontSize: '14px',
                                    padding: '8px 16px',
                                    borderRadius: '20px'
                                }}>
                                    {film.isLocal ? 'Local' : 'TMDB'}
                                </Tag>
                            </div>

                            <Paragraph style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '18px',
                                lineHeight: 1.6,
                                marginBottom: '32px',
                                maxWidth: '600px'
                            }}>
                                {film.description || 'No description available for this film.'}
                            </Paragraph>

                            <div style={{
                                display: 'flex',
                                gap: '16px',
                                flexWrap: 'wrap',
                                marginBottom: '24px'
                            }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<PlayCircleOutlined />}
                                    onClick={handleWatchTrailer}
                                    style={{
                                        height: '48px',
                                        padding: '0 32px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        background: '#E50914',
                                        borderColor: '#E50914',
                                        borderRadius: '8px'
                                    }}
                                >
                                    WATCH TRAILER
                                </Button>


                                <Button
                                    type="text"
                                    icon={<HeartFilled />}
                                    onClick={handleLikeToggle}
                                    style={{
                                        height: '48px',
                                        width: '48px',
                                        borderRadius: '50%',
                                        background: isLiked(film.id) ? 'rgba(255, 107, 107, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        color: 'white'
                                    }}
                                />
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                flexWrap: 'wrap'
                            }}>

                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {relatedFilms.length > 0 && (
                <div style={{ marginBottom: '48px' }}>
                    <Title level={2} style={{
                        color: '#2c3e50',
                        marginBottom: '24px',
                        fontWeight: 700
                    }}>
                        More Like This
                    </Title>

                    <Row gutter={[24, 24]}>
                        {relatedFilms.map((relatedFilm) => (
                            <Col xs={12} sm={8} md={6} lg={4} key={relatedFilm.id}>
                                <Card
                                    hoverable
                                    cover={
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                alt={relatedFilm.title}
                                                src={relatedFilm.poster || '/vite.svg'}
                                                style={{
                                                    height: 240,
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                    borderTopLeftRadius: 12,
                                                    borderTopRightRadius: 12
                                                }}
                                            />
                                            {relatedFilm.rating && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    background: 'rgba(0, 0, 0, 0.8)',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    <StarFilled style={{ color: '#f39c12' }} />
                                                    {relatedFilm.rating.toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                    }
                                    style={{
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        cursor: 'pointer'
                                    }}
                                    bodyStyle={{ padding: '16px' }}
                                    onClick={() => navigate(`/film/${relatedFilm.id}`)}
                                >
                                    <Title level={5} style={{
                                        marginBottom: '8px',
                                        fontWeight: 600,
                                        color: '#2c3e50',
                                        lineHeight: 1.3,
                                        fontSize: '14px'
                                    }}>
                                        {relatedFilm.title}
                                    </Title>
                                    <Text style={{
                                        color: '#7f8c8d',
                                        fontSize: '12px'
                                    }}>
                                        {relatedFilm.year} • {relatedFilm.type}
                                    </Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {showTrailerModal && trailers.length > 0 && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.9)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '800px',
                        maxHeight: '90vh'
                    }}>
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => setShowTrailerModal(false)}
                            style={{
                                position: 'absolute',
                                top: '-50px',
                                right: 0,
                                color: 'white',
                                fontSize: '24px',
                                zIndex: 1001
                            }}
                        />
                        <iframe
                            src={`https://www.youtube.com/embed/${trailers[0].key}?autoplay=1`}
                            title="Film Trailer"
                            style={{
                                width: '100%',
                                height: '450px',
                                border: 'none',
                                borderRadius: '12px'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

        </div>
    );
}
