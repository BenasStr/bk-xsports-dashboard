import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, List, Checkbox } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';
import { CategoryEditPayload, CategoryPayload, SportEditPayload, VariantPayload } from '../../../api/apipayloads';
import { getVariants } from '../../../api/api';
import { useSessionStorage } from '../../../hooks';
import { LoadingOutlined } from '@ant-design/icons';


const CategoryEditPage: React.FC = () => {
    const {sessionStorage} = useSessionStorage();

    const handleFormSubmit = (values: SportEditPayload) => {
        console.log(values);
    }

    useEffect(() => {
        console.log("uga buga")
    }, []);

    return (
        <div>
        Category Edit
        
        <Form onFinish={handleFormSubmit}>
        <Form.Item name="name" rules={[{ required: true, message: 'Please input the name of the sport!' }]}>
            <Input placeholder='Name'/>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit">
            Submit
            </Button>
        </Form.Item>
        </Form>
        </div>
    );
};

export default CategoryEditPage;