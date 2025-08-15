import React, { useState } from 'react';
import { Tag, Space, Typography, Tooltip, Badge, Button } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, HeartFilled, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useSessions } from '../store/hooks';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const HeaderSessionInfo = () => {
    const { sessions } = useSessions();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    if (!sessions || sessions.length === 0) {
        return null;
    }

    const getNextSession = () => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const upcomingSessions = sessions
            .filter(session => {
                const sessionDate = session.date;
                return sessionDate >= today;
            })
            .sort((a, b) => {
                const dateA = new Date(a.date + 'T' + a.time);
                const dateB = new Date(b.date + 'T' + b.time);
                return dateA - dateB;
            });

        return upcomingSessions[0];
    };

    const nextSession = getNextSession();

    if (!nextSession) {
        return null;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Сьогодні';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Завтра';
        } else {
            return date.toLocaleDateString('uk-UA', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const getTimeUntilSession = () => {
        const now = new Date();
        const sessionDateTime = new Date(nextSession.date + 'T' + nextSession.time);
        const diff = sessionDateTime - now;

        if (diff <= 0) return 'Зараз';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `через ${hours}г ${minutes}хв`;
        } else {
            return `через ${minutes}хв`;
        }
    };

    const getHallLabel = (hallNumber) => {
        const hallLabels = {
            '1': 'Premium',
            '2': 'Standard',
            '3': 'VIP',
            '4': 'IMAX'
        };
        return hallLabels[hallNumber] || `Зал ${hallNumber}`;
    };

    const handleViewAllSessions = () => {
        navigate('/favoritesessions');
    };

    const handleCreateSession = () => {
        navigate('/createsession');
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                background: isHovered
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                borderRadius: '24px',
                border: '2px solid rgba(102, 126, 234, 0.3)',
                marginLeft: '16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: isHovered
                    ? '0 4px 20px rgba(102, 126, 234, 0.3)'
                    : '0 2px 10px rgba(102, 126, 234, 0.2)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleViewAllSessions}
        >
            <HeartFilled style={{ color: '#ff6b6b', fontSize: '16px' }} />

            <Space size="small" direction="vertical" style={{ margin: 0 }}>
                <Space size="small">
                    <Text strong style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '700' }}>
                        {nextSession.title}
                    </Text>

                    <Tag size="default" icon={<CalendarOutlined />} color="blue" style={{ fontWeight: '600', fontSize: '13px' }}>
                        {formatDate(nextSession.date)}
                    </Tag>

                    <Tag size="default" icon={<ClockCircleOutlined />} color="green" style={{ fontWeight: '600', fontSize: '13px' }}>
                        {nextSession.time}
                    </Tag>
                </Space>

                <Space size="small">
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {getTimeUntilSession()}
                    </Text>

                    <Tag size="small" color="purple">
                        {getHallLabel(nextSession.hall)}
                    </Tag>

                    {sessions.length > 1 && (
                        <Badge
                            count={sessions.length - 1}
                            size="small"
                            style={{ backgroundColor: '#52c41a' }}
                            title={`Ще ${sessions.length - 1} сеансів`}
                        />
                    )}
                </Space>
            </Space>

            {/* Додаткові кнопки при наведенні */}
            {isHovered && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '8px',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 1000
                }}>
                    <Tooltip title="Переглянути всі сеанси">
                        <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewAllSessions();
                            }}
                            style={{
                                borderRadius: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                        />
                    </Tooltip>

                    <Tooltip title="Створити новий сеанс">
                        <Button
                            type="primary"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCreateSession();
                            }}
                            style={{
                                borderRadius: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                        />
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default HeaderSessionInfo;
