import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Upload,
} from 'antd';
import { createFilm, getFilmById, editFilm, getLocalFilms } from '../services/film.servise';
import { useMessage } from '../hooks/useMessage';
import { useNavigate, useParams } from 'react-router-dom';
const { TextArea } = Input;

const normFile = (e) => {
    return e?.file.originFileObj;
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
};

const FilmForm = () => {
    const { contextHolder, showSuccess, showError } = useMessage();
    const navigate = useNavigate();
    let params = useParams();
    const [editMode, setEditMode] = useState(false);
    const [isLocal, setIsLocal] = useState(false);
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
    }

    const onSubmit = async (item) => {
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
    }
    const onCancel = () => {
        navigate(-1);
    };

    return (
        <>
            {contextHolder}
            <h2>{editMode ? "Edit Film" : "Create New Film"}</h2>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={onSubmit}
                form={form}
            >
                <Form.Item label="Title" name="title">
                    <Input />
                </Form.Item>
                <Form.Item label="Duration" name="duration">
                    <InputNumber addonAfter="m" />
                </Form.Item>
                <Form.Item label="Year" name="year">
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="poster"
                    label="Poster URL"
                >
                    <Input placeholder="Enter product image URL" />
                </Form.Item>
                <Form.Item
                    name="trailer"
                    label="Trailer URL"
                >
                    <Input placeholder="Enter film trailer URL" />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            {editMode ? "Edit" : "Create"}
                        </Button>
                        <Button htmlType="button" onClick={onCancel}>
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form >
        </>
    );
};
export default () => <FilmForm />;