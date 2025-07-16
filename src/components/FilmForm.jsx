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
import { createFilm, loadCategories,getFilmById,editFilm } from '../services/film.servise';
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
    const [categories, setCategories] = useState([]);
    const { contextHolder, showSuccess, showError } = useMessage();
    const navigate = useNavigate();
    let params = useParams();
    const [editMode, setEditMode] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        fetchCategories();

        if (params.id) {
            setEditMode(true);
            loadFilmData(params.id);
        }
    }, []);


    async function loadFilmData(id) {
        const product = await getFilmById(id);
        form.setFieldsValue(product);
    }

    async function fetchCategories() {
        const data = await loadCategories();
        setCategories(data || []);
    }

    const onSubmit = async (item) => {
        let res = false;

        if (editMode) {
            item.id = params.id;
            res = await editFilm(item);
        }
        else {
            res = await createFilm(item);
        }

        if (!res)
            showError(`Failed to ${editMode ? "update" : "create"} film!`);
        else {
            showSuccess(`Film ${editMode ? "updated" : "created"} successfully!`);
            // TODO: show success message globally
            // navigate('/products');
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

                <Form.Item label="Category" name="category">
                    <Select
                        options={categories.map(cat => ({ label: cat.id || cat, value: cat }))}
                    />
                </Form.Item>

                <Form.Item label="Year" name="year">
                    <InputNumber/>
                </Form.Item>

                {/* <Form.Item label="Upload" name="image" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload multiple={false} action="/upload.do" listType="picture-card">
                        <button
                            style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                            type="button"
                        >
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item> */}
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