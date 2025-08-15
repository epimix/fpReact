import React, { useContext } from 'react';
import { getPopularFilms, getLocalFilms } from '../services/film.servise';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Spin, Empty, Tag } from 'antd';
import { PlayCircleOutlined, StarFilled, FireFilled, HeartFilled } from '@ant-design/icons';
import { likeContext } from '../contexts/likeContext';

const { Title, Paragraph } = Typography;
const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w300';

export default function Home() {
    const navigate = useNavigate();
    const [films, setFilms] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const { toggleLike, isLiked } = useContext(likeContext);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const tmdb = await getPopularFilms();
            const local = getLocalFilms();
            const tmdbFilms = (tmdb?.results || []).map(item => ({
                id: item.id,
                poster: item.poster_path ? TMDB_IMAGE + item.poster_path : '',
                title: item.title,
                year: item.release_date ? item.release_date.slice(0, 4) : '',
                type: 'TMDB',
                isLocal: false,
                rating: item.vote_average,
            }));
            const localFilms = (local || []).map(item => ({
                ...item,
                poster: item.poster || '',
                year: item.year || '',
                type: 'Local',
                isLocal: true,
                rating: item.rating || 0,
            }));
            setFilms([...localFilms, ...tmdbFilms]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleLikeToggle = (filmId, filmTitle) => {
        const wasLiked = isLiked(filmId);
        toggleLike(filmId);

        if (!wasLiked) {
            console.log(`${filmTitle} added to favorites`);
        } else {
            console.log(`${filmTitle} removed from favorites`);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    return (

        <div className="fade-in-up" style={{ maxWidth: 1400, margin: '0 auto' }}>

            <div style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: '24px',
                padding: '48px 32px',
                marginBottom: '48px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
                    animation: 'rotate 20s linear infinite'
                }} />
                <Title level={1} style={{
                    color: '#2c3e50',
                    marginBottom: '16px',
                    fontSize: '3rem',
                    fontWeight: 800,
                    letterSpacing: '-1px'
                }}>
                    create login!
                    🎬 Welcome to Film Gallery
                </Title>
                <Paragraph style={{
                    fontSize: '18px',
                    color: '#5a6c7d',
                    marginBottom: '32px',
                    maxWidth: '600px',
                    margin: '0 auto 32px auto'
                }}>
                    Discover amazing films from around the world. Browse popular movies, add your favorites, and create your own film collection.
                </Paragraph>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/films">
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlayCircleOutlined />}
                            style={{
                                height: '48px',
                                padding: '0 32px',
                                fontSize: '16px',
                                fontWeight: 600
                            }}
                        >
                            Browse Films
                        </Button>
                    </Link>
                    <Link to="/create">
                        <Button
                            size="large"
                            icon={<FireFilled />}
                            style={{
                                height: '48px',
                                padding: '0 32px',
                                fontSize: '16px',
                                fontWeight: 600
                            }}
                        >
                            Add Your Film
                        </Button>
                    </Link>
                </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '32px'
                }}>
                    <StarFilled style={{ color: '#f39c12', fontSize: '24px' }} />
                    <Title level={2} style={{
                        margin: 0,
                        color: '#2c3e50',
                        fontWeight: 700
                    }}>
                        Popular Films
                    </Title>
                </div>

                {films.length === 0 ? (
                    <Empty
                        description="No films available"
                        style={{ margin: '48px 0' }}
                    />
                ) : (
                    <Row gutter={[24, 24]} justify="start">
                        {films.slice(0, 12).map((film, index) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={film.id}>
                                <Card
                                    hoverable
                                    onClick={() => navigate(`/film/${film.id}`)}
                                    cover={
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                alt={film.title}
                                                src={film.poster || '/vite.svg'}
                                                style={{
                                                    height: 360,
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                    borderTopLeftRadius: 16,
                                                    borderTopRightRadius: 16
                                                }}
                                            />
                                            {film.rating && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    right: '12px',
                                                    background: 'rgba(0, 0, 0, 0.8)',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    <StarFilled style={{ color: '#f39c12' }} />
                                                    {film.rating.toFixed(1)}
                                                </div>
                                            )}
                                            {film.isLocal && (
                                                <Tag
                                                    color="green"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '12px',
                                                        left: '12px',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Your Film
                                                </Tag>
                                            )}
                                            <Button
                                                type="text"
                                                icon={<HeartFilled />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLikeToggle(film.id, film.title);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '12px',
                                                    right: '12px',
                                                    background: isLiked(film.id) ? 'rgba(255, 107, 107, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '40px',
                                                    height: '40px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        </div>
                                    }
                                    style={{
                                        borderRadius: 16,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                    bodyStyle={{ padding: '20px' }}
                                >
                                    <Title level={5} style={{
                                        marginBottom: '8px',
                                        fontWeight: 700,
                                        color: '#2c3e50',
                                        lineHeight: 1.3
                                    }}>
                                        {film.title}
                                    </Title>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Paragraph style={{
                                            margin: 0,
                                            color: '#7f8c8d',
                                            fontWeight: 500
                                        }}>
                                            {film.year} • {film.type}
                                        </Paragraph>
                                        <Tag color={film.isLocal ? 'green' : 'blue'}>
                                            {film.isLocal ? 'Local' : 'TMDB'}
                                        </Tag>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            <div style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderRadius: '20px',
                padding: '32px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <Title level={3} style={{
                    color: '#2c3e50',
                    marginBottom: '16px'
                }}>
                    Ready to explore more?
                </Title>
                <Paragraph style={{
                    color: '#5a6c7d',
                    marginBottom: '24px'
                }}>
                    Discover thousands of films, create your own collection, and share your favorites with friends.
                </Paragraph>
                <Link to="/films">
                    <Button
                        type="primary"
                        size="large"
                        style={{
                            height: '48px',
                            padding: '0 32px',
                            fontSize: '16px',
                            fontWeight: 600
                        }}
                    >
                        Explore All Films
                    </Button>
                </Link>
            </div>
        </div>
    );
}