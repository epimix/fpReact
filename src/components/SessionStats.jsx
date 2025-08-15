import React from 'react';
import { Card, Row, Col, Statistic, Button, Typography } from 'antd';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    HeartFilled,
    HomeOutlined,
    PlusOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useSessions } from '../store/hooks';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const SessionStats = () => {
    const { sessions } = useSessions();
    const navigate = useNavigate();

    const stats = React.useMemo(() => {
        const total = sessions.length;
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const upcoming = sessions.filter(s => {
            const sessionDateTime = new Date(s.date + 'T' + s.time);
            return sessionDateTime > now;
        }).length;

        const todaySessions = sessions.filter(s => s.date === today).length;
        const halls = [...new Set(sessions.map(s => s.hall))].length;

        // Найближчий сеанс
        const nextSession = sessions
            .filter(s => new Date(s.date + 'T' + s.time) > now)
            .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))[0];

        return { total, upcoming, todaySessions, halls, nextSession };
    }, [sessions]);

    const handleCreateSession = () => {
        navigate('/createsession');
    };

    const handleViewSessions = () => {
        navigate('/favoritesessions');
    };

    if (sessions.length === 0) {
        return (
            <Card
                style={{
                    marginBottom: '24px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                }}
            >
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <HeartFilled style={{ fontSize: '48px', color: '#ff6b6b', marginBottom: '16px' }} />
                    <Title level={3} style={{ color: '#2c3e50', marginBottom: '8px' }}>
                        Немає збережених сеансів
                    </Title>
                    <Text type="secondary" style={{ fontSize: '16px', marginBottom: '24px', display: 'block' }}>
                        Створіть свій перший кіносеанс та додайте його до улюблених
                    </Text>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={handleCreateSession}
                        style={{ borderRadius: '12px', height: '48px', padding: '0 32px' }}
                    >
                        Створити перший сеанс
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div style={{ marginBottom: '32px' }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '24px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
                <Title level={3} style={{ color: '#2c3e50', marginBottom: '8px' }}>
                    📅 Статистика ваших кіносеансів
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    Управляйте та відстежуйте ваші улюблені кіносеанси
                </Text>
            </div>

            {/* Статистика */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={12} sm={6}>
                    <Card
                        hoverable
                        style={{
                            borderRadius: '12px',
                            textAlign: 'center',
                            border: '1px solid #f0f0f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <Statistic
                            title="Всього сеансів"
                            value={stats.total}
                            prefix={<HeartFilled style={{ color: '#ff6b6b' }} />}
                            valueStyle={{ color: '#2c3e50', fontSize: '24px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card
                        hoverable
                        style={{
                            borderRadius: '12px',
                            textAlign: 'center',
                            border: '1px solid #f0f0f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <Statistic
                            title="Майбутні"
                            value={stats.upcoming}
                            prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card
                        hoverable
                        style={{
                            borderRadius: '12px',
                            textAlign: 'center',
                            border: '1px solid #f0f0f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <Statistic
                            title="Сьогодні"
                            value={stats.todaySessions}
                            prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card
                        hoverable
                        style={{
                            borderRadius: '12px',
                            textAlign: 'center',
                            border: '1px solid #f0f0f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <Statistic
                            title="Активних залів"
                            value={stats.halls}
                            prefix={<HomeOutlined style={{ color: '#722ed1' }} />}
                            valueStyle={{ color: '#722ed1', fontSize: '24px' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Найближчий сеанс */}
            {stats.nextSession && (
                <Card
                    style={{
                        marginBottom: '24px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        <div>
                            <Title level={4} style={{ color: '#2c3e50', marginBottom: '8px' }}>
                                🎬 Найближчий сеанс
                            </Title>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <Text strong style={{ fontSize: '16px', color: '#2c3e50' }}>
                                    {stats.nextSession.title}
                                </Text>
                                <Text type="secondary">
                                    {new Date(stats.nextSession.date).toLocaleDateString('uk-UA', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Text>
                                <Text type="secondary">
                                    {stats.nextSession.time}
                                </Text>
                                <Text type="secondary">
                                    Зал {stats.nextSession.hall}
                                </Text>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Button
                                icon={<EyeOutlined />}
                                onClick={handleViewSessions}
                                style={{ borderRadius: '8px' }}
                            >
                                Переглянути всі
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleCreateSession}
                                style={{ borderRadius: '8px' }}
                            >
                                Новий сеанс
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Кнопки дій */}
            <div style={{ textAlign: 'center' }}>
                <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={handleCreateSession}
                    style={{
                        borderRadius: '12px',
                        height: '48px',
                        padding: '0 32px',
                        marginRight: '16px'
                    }}
                >
                    Створити новий сеанс
                </Button>
                <Button
                    size="large"
                    icon={<EyeOutlined />}
                    onClick={handleViewSessions}
                    style={{
                        borderRadius: '12px',
                        height: '48px',
                        padding: '0 32px'
                    }}
                >
                    Переглянути всі сеанси
                </Button>
            </div>
        </div>
    );
};

export default SessionStats;
