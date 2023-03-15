import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, List, Checkbox } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';
import { SportEditPayload, VariantPayload } from '../../../api/apipayloads';
import { getVariants } from '../../../api/api';
import { useSessionStorage } from '../../../hooks';
import { LoadingOutlined } from '@ant-design/icons';


const SportAddPage: React.FC = () => {
  const [form] = Form.useForm<SportEditPayload>();
  const {sessionStorage} = useSessionStorage();
  const [variants, setVariants] = useState<VariantPayload[]>([]);

  const getVariantsData = async () => {
    try {
      const data: VariantPayload[] = await getVariants(sessionStorage?sessionStorage:"");
      setVariants(data)
    } catch (err) {
      console.log("Failed to reterieve sports")
    }
  }

  const handleFormSubmit = (values: SportEditPayload) => {
    console.log(values);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  useEffect(() => {
    getVariantsData()
    console.log(variants)
  }, []);

  return ( !variants ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
    <div>
      Sport Edit
      
      <Form form={form} onFinish={handleFormSubmit}>
      <Form.Item name="name" rules={[{ required: true, message: 'Please input the name of the sport!' }]}>
        <Input placeholder='Name'/>
      </Form.Item>

      {/* <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Please upload an image!' }]}>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          // onChange={handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </Form.Item> */}

      <Form.Item label="Variants" name="variantIds">
        <Checkbox.Group>
          <List
            dataSource={variants}
            renderItem={(variant) => (
              <List.Item>
                <Checkbox value={variant.id}>{variant.name}</Checkbox>
              </List.Item>
            )}
          />
        </Checkbox.Group>
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

export default SportAddPage;