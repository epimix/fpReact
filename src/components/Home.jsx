import React from 'react';
import { getPopularFilms, getLocalFilms } from '../services/film.servise';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;
const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w300';

export default function Home() {
    const [films, setFilms] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

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
            }));
            const localFilms = (local || []).map(item => ({
                ...item,
                poster: item.poster || '',
                year: item.year || '',
                type: 'Local',
                isLocal: true,
            }));
            setFilms([...localFilms, ...tmdbFilms]);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
            <div style={{
                background: '#f5f7fa',
                borderRadius: 16,
                padding: '40px 24px 32px 24px',
                marginBottom: 36,
                textAlign: 'center',
                boxShadow: '0 2px 16px #e6eaf1'
            }}>
                <Title level={1} style={{ color: '#1677ff', marginBottom: 0 }}>Welcome to Film Gallery</Title>
                                
            </div>
            <Title level={3} style={{ color: '#222', marginBottom: 24 }}>Popular Films</Title>
            <Row gutter={[24, 24]} justify="start">
                {films.slice(0, 12).map(film => (
                    <Col xs={24} sm={12} md={8} lg={6} key={film.id}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt={film.title}
                                    src={film.poster || '/vite.svg'}
                                    style={{ height: 320, objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                                />
                            }
                            style={{ borderRadius: 8, boxShadow: '0 2px 12px #e6eaf1' }}
                        >
                            <Title level={5} style={{ marginBottom: 4 }}>{film.title}</Title>
                            <Paragraph style={{ margin: 0, color: '#888' }}>{film.year} {film.type === 'Local' ? '(Your Film)' : ''}</Paragraph>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}