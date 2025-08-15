import React, { useState, useMemo } from 'react';
import {
    Card,
    Typography,
    Tag,
    Button,
    Empty,
    Row,
    Col,
    Space,
    Input,
    Select,
    Statistic,
    Divider,
    Tooltip,
    Popconfirm,
    message,
    Badge,
    Calendar,
    Modal
} from 'antd';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    HomeOutlined,
    DeleteOutlined,
    HeartFilled,
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
    EyeOutlined,
    EditOutlined,
    PlusOutlined,
    BarChartOutlined,
    CalendarTwoTone
} from '@ant-design/icons';
import { useSessions, useAppDispatch } from '../store/hooks';
import { removeSession, clearAllSessions } from '../store/sessionsSlice';
import { useMessage } from '../hooks/useMessage';
import { useNavigate } from 'react-router-dom';
import './FavoriteSessions.css';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const FavoriteSessions = () => {
    const { sessions, loading } = useSessions();
    const dispatch = useAppDispatch();
    const { contextHolder, showSuccess, showError } = useMessage();
    const navigate = useNavigate();

    // State для фільтрів та пошуку
    const [searchText, setSearchText] = useState('');
    const [filterHall, setFilterHall] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedDate, setSelectedDate] = useState(null);
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);

    // Фільтрація та сортування сеансів
    const filteredAndSortedSessions = useMemo(() => {
        let filtered = sessions.filter(session => {
            const matchesSearch = session.title.toLowerCase().includes(searchText.toLowerCase()) ||
                session.notes?.toLowerCase().includes(searchText.toLowerCase());
            const matchesHall = filterHall === 'all' || session.hall === filterHall;
            const matchesDate = !selectedDate || session.date === selectedDate;

            return matchesSearch && matchesHall && matchesDate;
        });

        // Сортування
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case 'time':
                    comparison = a.time.localeCompare(b.time);
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'duration':
                    comparison = (a.duration || 0) - (b.duration || 0);
                    break;
                default:
                    comparison = 0;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [sessions, searchText, filterHall, sortBy, sortOrder, selectedDate]);

    // Статистика
    const stats = useMemo(() => {
        const total = sessions.length;
        const upcoming = sessions.filter(s => new Date(s.date + 'T' + s.time) > new Date()).length;
        const today = sessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length;
        const halls = [...new Set(sessions.map(s => s.hall))].length;

        return { total, upcoming, today, halls };
    }, [sessions]);

    const handleRemoveSession = async (sessionId) => {
        try {
            await dispatch(removeSession(sessionId));
            showSuccess('Сеанс видалено з улюблених');
        } catch (error) {
            showError('Помилка при видаленні сеансу');
            console.error('Error removing session:', error);
        }
    };

    const handleClearAllSessions = async () => {
        try {
            await dispatch(clearAllSessions());
            showSuccess('Всі сеанси видалено');
        } catch (error) {
            showError('Помилка при очищенні');
            console.error('Error clearing sessions:', error);
        }
    };

    const handleEditSession = (session) => {
        // Навігація до форми редагування
        navigate('/createsession', {
            state: {
                editMode: true,
                sessionData: session
            }
        });
    };

    const handleViewSession = (session) => {
        Modal.info({
            title: `Деталі сеансу: ${session.title}`,
            width: 600,
            content: (
                <div style={{ padding: '16px 0' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Statistic title="Дата" value={formatDate(session.date)} />
                        </Col>
                        <Col span={12}>
                            <Statistic title="Час" value={session.time} />
                        </Col>
                        <Col span={12}>
                            <Statistic title="Зал" value={`Зал ${session.hall}`} />
                        </Col>
                        <Col span={12}>
                            <Statistic title="Тривалість" value={`${session.duration || 'Не вказано'} хв`} />
                        </Col>
                        <Col span={24}>
                            <Statistic title="Контакт" value={session.contact} />
                        </Col>
                        {session.notes && (
                            <Col span={24}>
                                <Paragraph>
                                    <strong>Нотатки:</strong> {session.notes}
                                </Paragraph>
                            </Col>
                        )}
                    </Row>
                </div>
            ),
            okText: 'Закрити'
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    const formatTime = (timeString) => {
        return timeString;
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

    const getHallColor = (hallNumber) => {
        const hallColors = {
            '1': 'gold',
            '2': 'blue',
            '3': 'purple',
            '4': 'green'
        };
        return hallColors[hallNumber] || 'default';
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
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
        <div className="favorite-sessions-container">
            {contextHolder}

            {/* Header з статистикою */}
            <div className="favorite-sessions-header">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Title level={2} className="favorite-sessions-title">
                        <HeartFilled style={{ color: '#ff6b6b' }} />
                        Улюблені Сеанси
                    </Title>
                    <Text className="favorite-sessions-subtitle">
                        Управляйте вашими збереженими кіносеансами
                    </Text>
                </div>

                {/* Статистика */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Всього сеансів"
                                value={stats.total}
                                prefix={<HeartFilled style={{ color: '#ff6b6b' }} />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Майбутні"
                                value={stats.upcoming}
                                prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Сьогодні"
                                value={stats.today}
                                prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Активних залів"
                                value={stats.halls}
                                prefix={<HomeOutlined style={{ color: '#722ed1' }} />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Фільтри та пошук */}
                <Card style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={8}>
                            <Search
                                placeholder="Пошук за назвою фільму або нотатками..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                prefix={<SearchOutlined />}
                                allowClear
                            />
                        </Col>
                        <Col xs={12} sm={4}>
                            <Select
                                value={filterHall}
                                onChange={setFilterHall}
                                placeholder="Всі зали"
                                style={{ width: '100%' }}
                            >
                                <Option value="all">Всі зали</Option>
                                <Option value="1">Зал 1 - Premium</Option>
                                <Option value="2">Зал 2 - Standard</Option>
                                <Option value="3">Зал 3 - VIP</Option>
                                <Option value="4">Зал 4 - IMAX</Option>
                            </Select>
                        </Col>
                        <Col xs={12} sm={4}>
                            <Select
                                value={sortBy}
                                onChange={setSortBy}
                                placeholder="Сортування"
                                style={{ width: '100%' }}
                            >
                                <Option value="date">За датою</Option>
                                <Option value="time">За часом</Option>
                                <Option value="title">За назвою</Option>
                                <Option value="duration">За тривалістю</Option>
                            </Select>
                        </Col>
                        <Col xs={12} sm={4}>
                            <Button
                                icon={<SortAscendingOutlined />}
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                style={{ width: '100%' }}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </Button>
                        </Col>
                        <Col xs={12} sm={4}>
                            <Button
                                icon={<CalendarTwoTone />}
                                onClick={() => setCalendarModalVisible(true)}
                                style={{ width: '100%' }}
                            >
                                Календар
                            </Button>
                        </Col>
                        <Col xs={12} sm={4}>
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/createsession')}
                                type="primary"
                                style={{ width: '100%' }}
                            >
                                Новий сеанс
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* Результати пошуку */}
            {filteredAndSortedSessions.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                                    {sessions.length === 0 ? 'Немає улюблених сеансів' : 'Немає результатів пошуку'}
                                </div>
                                <div style={{ color: '#666', marginBottom: '16px' }}>
                                    {sessions.length === 0
                                        ? 'Створіть свій перший кіносеанс'
                                        : 'Спробуйте змінити фільтри або пошуковий запит'
                                    }
                                </div>
                                {sessions.length === 0 && (
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => navigate('/createsession')}
                                    >
                                        Створити сеанс
                                    </Button>
                                )}
                            </div>
                        }
                    />
                </div>
            ) : (
                <>
                    {/* Інформація про результати */}
                    <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                        <Text type="secondary">
                            Знайдено {filteredAndSortedSessions.length} з {sessions.length} сеансів
                        </Text>
                        {sessions.length > 0 && (
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleClearAllSessions}
                                style={{ marginLeft: '16px' }}
                            >
                                Очистити всі
                            </Button>
                        )}
                    </div>

                    {/* Сітка сеансів */}
                    <Row gutter={[16, 16]}>
                        {filteredAndSortedSessions.map((session) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={session.id}>
                                <Card
                                    hoverable
                                    className="session-card"
                                    actions={[
                                        <Tooltip title="Переглянути деталі">
                                            <Button
                                                type="text"
                                                icon={<EyeOutlined />}
                                                onClick={() => handleViewSession(session)}
                                                className="view-button"
                                            >
                                                Деталі
                                            </Button>
                                        </Tooltip>,
                                        <Tooltip title="Редагувати сеанс">
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => handleEditSession(session)}
                                                className="edit-button"
                                            >
                                                Редагувати
                                            </Button>
                                        </Tooltip>,
                                        <Popconfirm
                                            title="Видалити сеанс"
                                            description={`Ви впевнені, що хочете видалити "${session.title}"?`}
                                            onConfirm={() => handleRemoveSession(session.id)}
                                            okText="Так"
                                            cancelText="Ні"
                                        >
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                className="remove-button"
                                            >
                                                Видалити
                                            </Button>
                                        </Popconfirm>
                                    ]}
                                >
                                    <div className="session-info">
                                        <Title level={4} className="session-title">
                                            {session.title}
                                        </Title>

                                        <div className="session-meta">
                                            <div className="session-meta-item">
                                                <CalendarOutlined style={{ color: '#1890ff' }} />
                                                <Text style={{ fontSize: '14px' }}>
                                                    {formatDate(session.date)}
                                                </Text>
                                            </div>

                                            <div className="session-meta-item">
                                                <ClockCircleOutlined style={{ color: '#52c41a' }} />
                                                <Text style={{ fontSize: '14px' }}>
                                                    {formatTime(session.time)}
                                                </Text>
                                            </div>

                                            <div className="session-meta-item">
                                                <HomeOutlined style={{ color: '#722ed1' }} />
                                                <Text style={{ fontSize: '14px' }}>
                                                    {getHallLabel(session.hall)}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '12px' }}>
                                        {session.duration && (
                                            <Tag color="blue" style={{ marginBottom: '8px' }}>
                                                {session.duration} хв
                                            </Tag>
                                        )}

                                        <Tag color={getHallColor(session.hall)} style={{ marginBottom: '8px' }}>
                                            Зал {session.hall}
                                        </Tag>

                                        {/* Показуємо, чи сеанс сьогодні або завтра */}
                                        {(() => {
                                            const today = new Date().toISOString().split('T')[0];
                                            const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

                                            if (session.date === today) {
                                                return <Badge status="processing" text="Сьогодні" />;
                                            } else if (session.date === tomorrow) {
                                                return <Badge status="warning" text="Завтра" />;
                                            } else if (session.date < today) {
                                                return <Badge status="default" text="Минуло" />;
                                            } else {
                                                return <Badge status="success" text="Майбутній" />;
                                            }
                                        })()}
                                    </div>

                                    {session.notes && (
                                        <div className="session-notes">
                                            <Text type="secondary">{session.notes}</Text>
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}

            {/* Модальне вікно календаря */}
            <Modal
                title="Календар сеансів"
                open={calendarModalVisible}
                onCancel={() => setCalendarModalVisible(false)}
                footer={null}
                width={800}
            >
                <Calendar
                    fullscreen={false}
                    dateCellRender={(date) => {
                        const dateStr = date.format('YYYY-MM-DD');
                        const daySessions = sessions.filter(s => s.date === dateStr);

                        if (daySessions.length === 0) return null;

                        return (
                            <div style={{ padding: '2px' }}>
                                {daySessions.map(session => (
                                    <div
                                        key={session.id}
                                        style={{
                                            background: '#1890ff',
                                            color: 'white',
                                            padding: '1px 4px',
                                            margin: '1px 0',
                                            borderRadius: '2px',
                                            fontSize: '10px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            setCalendarModalVisible(false);
                                            handleViewSession(session);
                                        }}
                                    >
                                        {session.title} - {session.time}
                                    </div>
                                ))}
                            </div>
                        );
                    }}
                />
            </Modal>
        </div>
    );
};

export default FavoriteSessions;
