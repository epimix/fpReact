import { useEffect, useState } from 'react';
import { PlusOutlined, SaveOutlined, ArrowLeftOutlined, CameraOutlined, PlayCircleOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Upload,
    Card,
    Typography,
    Divider,
    Row,
    Col,
    Alert
} from 'antd';
import { createFilm, getFilmById, editFilm, getLocalFilms } from '../services/film.servise';
import { useMessage } from '../hooks/useMessage';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const normFile = (e) => {
    return e?.file.originFileObj;
};

const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
};

const FilmForm = () => {
    const { contextHolder, showSuccess, showError } = useMessage();
    const navigate = useNavigate();
    let params = useParams();
    const [editMode, setEditMode] = useState(false);
    const [isLocal, setIsLocal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (params.id) {
            const localFilm = getLocalFilms().find(f => String(f.id) === String(params.id));
            if (localFilm) {
                setEditMode(true);
                setIsLocal(true);
                form.setFieldsValue(localFilm);
            } else {
                setEditMode(false);
                setIsLocal(false);
                loadFilmData(params.id);
            }
        }
    }, []);

    async function loadFilmData(id) {
        setLoading(true);
        const product = await getFilmById(id);
        if (product) {
            form.setFieldsValue({
                title: product.title,
                year: product.release_date ? Number(product.release_date.slice(0, 4)) : '',
                poster: product.poster_path ? `https://image.tmdb.org/t/p/w200${product.poster_path}` : '',
                duration: product.runtime || '',
                trailer: '',
            });
        }
        setLoading(false);
    }

    const onSubmit = async (item) => {
        setLoading(true);
        let res = false;
        if (editMode && isLocal) {
            item.id = params.id;
            res = await editFilm(item);
        } else {
            res = await createFilm(item);
        }
        if (!res)
            showError(`Failed to ${editMode ? "update" : "create"} film!`);
        else {
            showSuccess(`Film ${editMode ? "updated" : "created"} successfully!`);
            navigate(-1);
        }
        setLoading(false);
    }

    const onCancel = () => {
        navigate(-1);
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
                    {editMode ? (
                        <SaveOutlined style={{ fontSize: '24px', color: '#667eea' }} />
                    ) : (
                        <PlusOutlined style={{ fontSize: '24px', color: '#667eea' }} />
                    )}
                    <Title level={2} style={{
                        margin: 0,
                        color: '#2c3e50',
                        fontWeight: 700
                    }}>
                        {editMode ? "Edit Film" : "Create New Film"}
                    </Title>
                </div>
                <Paragraph style={{
                    margin: 0,
                    color: '#5a6c7d',
                    fontSize: '16px'
                }}>
                    {editMode
                        ? "Update your film information and details"
                        : "Add a new film to your collection with all the details"
                    }
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
                >
                    <Row gutter={24}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                        Film Title
                                    </span>
                                }
                                name="title"
                                rules={[{ required: true, message: 'Please enter the film title!' }]}
                            >
                                <Input
                                    placeholder="Enter film title"
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
                                        Release Year
                                    </span>
                                }
                                name="year"
                                rules={[{ required: true, message: 'Please enter the release year!' }]}
                            >
                                <InputNumber
                                    placeholder="2024"
                                    size="large"
                                    style={{ width: '100%', borderRadius: '8px' }}
                                    min={1900}
                                    max={new Date().getFullYear() + 10}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                        <ClockCircleOutlined style={{ marginRight: '8px' }} />
                                        Duration (minutes)
                                    </span>
                                }
                                name="duration"
                            >
                                <InputNumber
                                    placeholder="120"
                                    addonAfter="min"
                                    size="large"
                                    style={{ width: '100%', borderRadius: '8px' }}
                                    min={1}
                                    max={999}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                        <PlayCircleOutlined style={{ marginRight: '8px' }} />
                                        Trailer URL
                                    </span>
                                }
                                name="trailer"
                            >
                                <Input
                                    placeholder="https://youtube.com/watch?v=..."
                                    size="large"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label={
                            <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                <CameraOutlined style={{ marginRight: '8px' }} />
                                Poster URL
                            </span>
                        }
                        name="poster"
                        rules={[{ required: true, message: 'Please enter the poster URL!' }]}
                    >
                        <Input
                            placeholder="https://example.com/poster.jpg"
                            size="large"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Divider />

                    <Form.Item {...tailLayout}>
                        <Space size="large">
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={editMode ? <SaveOutlined /> : <PlusOutlined />}
                                size="large"
                                loading={loading}
                                style={{
                                    height: '48px',
                                    padding: '0 32px',
                                    fontWeight: 600,
                                    borderRadius: '12px'
                                }}
                            >
                                {editMode ? "Update Film" : "Create Film"}
                            </Button>
                            <Button
                                htmlType="button"
                                onClick={onCancel}
                                icon={<ArrowLeftOutlined />}
                                size="large"
                                style={{
                                    height: '48px',
                                    padding: '0 32px',
                                    fontWeight: 600,
                                    borderRadius: '12px'
                                }}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>


        </div>
    );
};

export default () => <FilmForm />;