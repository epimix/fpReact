import { useEffect, useState } from 'react';
import { PlusOutlined, SaveOutlined, CalendarOutlined, PhoneOutlined, VideoCameraOutlined, HomeOutlined, EditOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Upload,
    DatePicker,
    Card,
    Typography,
    Divider,
    Row,
    Col,
    TimePicker,
    message
} from 'antd';
import { useMessage } from '../hooks/useMessage';
import { useAppDispatch } from '../store/hooks';
import { addSession, removeSession } from '../store/sessionsSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const normFile = (e) => {
    return e?.file.originFileObj;
};

const FormSession = () => {
    const { contextHolder, showSuccess, showError } = useMessage();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Перевіряємо, чи це режим редагування
    const isEditMode = location.state?.editMode;
    const sessionData = location.state?.sessionData;

    // Ініціалізація форми для редагування
    useEffect(() => {
        if (isEditMode && sessionData) {
            form.setFieldsValue({
                title: sessionData.title,
                sessionDate: dayjs(sessionData.date),
                sessionTime: dayjs(sessionData.time, 'HH:mm'),
                category: sessionData.hall,
                number: sessionData.contact,
                duration: sessionData.duration,
                notes: sessionData.notes
            });
        }
    }, [isEditMode, sessionData, form]);

    const onSubmit = async (item) => {
        setLoading(true);
        try {
            const sessionData = {
                title: item.title,
                date: item.sessionDate?.format('YYYY-MM-DD'),
                time: item.sessionTime?.format('HH:mm'),
                hall: item.category,
                contact: item.number,
                duration: item.duration,
                notes: item.notes
            };

            if (isEditMode && location.state?.sessionData) {
                // Режим редагування - оновлюємо існуючий сеанс
                const oldSessionId = location.state.sessionData.id;

                // Видаляємо старий сеанс
                await dispatch(removeSession(oldSessionId));

                // Додаємо оновлений сеанс
                await dispatch(addSession(sessionData));

                showSuccess('Сеанс успішно оновлено!');
                navigate('/favoritesessions');
            } else {
                // Режим створення - додаємо новий сеанс
                await dispatch(addSession(sessionData));
                showSuccess('Сеанс створено успішно та додано до улюблених!');
                form.resetFields();
            }
        } catch (error) {
            showError('Помилка при збереженні сеансу!');
            console.error('Error saving session:', error);
        }
        setLoading(false);
    };

    const handleCancel = () => {
        if (isEditMode) {
            navigate('/favoritesessions');
        } else {
            form.resetFields();
        }
    };

    const getPageTitle = () => {
        return isEditMode ? 'Редагувати Сеанс' : 'Створити Кіносеанс';
    };

    const getPageDescription = () => {
        return isEditMode
            ? 'Внесіть зміни до існуючого кіносеансу'
            : 'Заплануйте новий кіносеанс з усіма деталями для вашого кінотеатру';
    };

    const getSubmitButtonText = () => {
        return isEditMode ? 'Оновити Сеанс' : 'Створити Сеанс';
    };

    const getSubmitButtonIcon = () => {
        return isEditMode ? <EditOutlined /> : <SaveOutlined />;
    };

    return (
        <div className="fade-in-up">
            {contextHolder}

            <div style={{
                marginBottom: '32px',
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px'
                }}>
                    <VideoCameraOutlined style={{
                        fontSize: '24px',
                        color: isEditMode ? '#52c41a' : '#667eea'
                    }} />
                    <Title level={2} style={{
                        margin: 0,
                        color: '#2c3e50',
                        fontWeight: 700
                    }}>
                        {getPageTitle()}
                    </Title>
                </div>
                <Paragraph style={{
                    margin: 0,
                    color: '#5a6c7d',
                    fontSize: '16px'
                }}>
                    {getPageDescription()}
                </Paragraph>
            </div>

            <Card style={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                    onFinish={onSubmit}
                    form={form}
                    disabled={loading}
                    initialValues={{
                        category: '1',
                        duration: 120
                    }}
                >
                    <Row gutter={24}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                        Назва фільму
                                    </span>
                                }
                                name="title"
                                rules={[{ required: true, message: 'Будь ласка, введіть назву фільму!' }]}
                            >
                                <Input
                                    placeholder="Введіть назву фільму"
                                    size="large"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                        <CalendarOutlined style={{ marginRight: '8px' }} />
                                        Дата сеансу
                                    </span>
                                }
                                name="sessionDate"
                                rules={[{ required: true, message: 'Будь ласка, виберіть дату сеансу!' }]}
                            >
                                <DatePicker
                                    placeholder="Виберіть дату"
                                    size="large"
                                    style={{ width: '100%', borderRadius: '8px' }}
                                    disabledDate={(current) => {
                                        // Забороняємо вибирати минулі дати
                                        return current && current < dayjs().startOf('day');
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                        Час сеансу
                                    </span>
                                }
                                name="sessionTime"
                                rules={[{ required: true, message: 'Будь ласка, виберіть час сеансу!' }]}
                            >
                                <TimePicker
                                    placeholder="Виберіть час"
                                    size="large"
                                    style={{ width: '100%', borderRadius: '8px' }}
                                    format="HH:mm"
                                    minuteStep={15}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                        <HomeOutlined style={{ marginRight: '8px' }} />
                                        Кінотеатр
                                    </span>
                                }
                                name="category"
                                rules={[{ required: true, message: 'Будь ласка, виберіть кінотеатр!' }]}
                            >
                                <Select
                                    placeholder="Виберіть кінотеатр"
                                    size="large"
                                    style={{ borderRadius: '8px' }}
                                >
                                    <Option value="1">Зал 1 - Premium</Option>
                                    <Option value="2">Зал 2 - Standard</Option>
                                    <Option value="3">Зал 3 - VIP</Option>
                                    <Option value="4">Зал 4 - IMAX</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                        <PhoneOutlined style={{ marginRight: '8px' }} />
                                        Контактний номер
                                    </span>
                                }
                                name="number"
                                rules={[
                                    { required: true, message: 'Будь ласка, введіть контактний номер!' },
                                    { pattern: /^\+?[0-9\s\-\(\)]+$/, message: 'Будь ласка, введіть коректний номер!' }
                                ]}
                            >
                                <Input
                                    placeholder="+380..."
                                    size="large"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                        Тривалість
                                    </span>
                                }
                                name="duration"
                            >
                                <InputNumber
                                    placeholder="120"
                                    addonAfter="хвилин"
                                    size="large"
                                    style={{ width: '100%', borderRadius: '8px' }}
                                    min={1}
                                    max={999}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label={
                            <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                Додаткові нотатки
                            </span>
                        }
                        name="notes"
                    >
                        <TextArea
                            placeholder="Будь-які спеціальні вимоги або нотатки для цього сеансу..."
                            rows={4}
                            style={{ borderRadius: '8px' }}
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>

                    <Divider />

                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <Space size="large">
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={getSubmitButtonIcon()}
                                size="large"
                                loading={loading}
                                style={{
                                    height: '48px',
                                    padding: '0 32px',
                                    fontWeight: 600,
                                    borderRadius: '12px'
                                }}
                            >
                                {getSubmitButtonText()}
                            </Button>
                            <Button
                                htmlType="button"
                                onClick={handleCancel}
                                size="large"
                                style={{
                                    height: '48px',
                                    padding: '0 32px',
                                    fontWeight: 600,
                                    borderRadius: '12px'
                                }}
                            >
                                {isEditMode ? 'Скасувати' : 'Скинути форму'}
                            </Button>
                            {isEditMode && (
                                <Button
                                    htmlType="button"
                                    onClick={() => navigate('/favoritesessions')}
                                    size="large"
                                    style={{
                                        height: '48px',
                                        padding: '0 32px',
                                        fontWeight: 600,
                                        borderRadius: '12px'
                                    }}
                                >
                                    Назад до сеансів
                                </Button>
                            )}
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default () => <FormSession />;
