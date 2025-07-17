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
    DatePicker
} from 'antd';
import { useMessage } from '../hooks/useMessage';

const normFile = (e) => {
    return e?.file.originFileObj;
};

const onChange = (date, dateString) => {
    console.log(date, dateString);
};

const handleChange = (value) => {
    console.log(`selected ${value}`);
};
const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
};

const FormSession = () => {
    const { contextHolder, showSuccess, showError } = useMessage();

    const onSubmit = async (item) => {
        const res = await createSession(item);
        console.log(item)
        if (!res)
            showError('Failed to create session!');
        else
            showSuccess('Session created successfully!');
    }

    return (
        <>
            {contextHolder}
            <h2>Create New Film</h2>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={onSubmit}
            >
                <Form.Item label="Title of film" name="title">
                    <Input />
                </Form.Item>

                <Form.Item label="Duration" name="duration">
                    <DatePicker onChange={onChange} />
                </Form.Item>

                <Form.Item label="Category" name="category">
                    <Select
                        defaultValue="1 hall"
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={[
                            { value: '1', label: '1hall' },
                            { value: '2', label: '2hall' },
                            { value: '3', label: '3hall' },
                            { value: '4', label: '4hall' },
                        ]}
                    />
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
                    name="number"
                    label="Number"
                >
                    <Space.Compact>
                        <Input placeholder="+380..." />
                    </Space.Compact>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                        <Button htmlType="button">
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form >
        </>
    );
};
export default () => <FormSession />;