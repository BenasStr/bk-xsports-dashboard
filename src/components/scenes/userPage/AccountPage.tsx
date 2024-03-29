import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Row, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
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

const AccountPage: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={4}></Col>
        <Col span={8} >
          Name:
          <Input/>
        </Col>
        <Col span={8}>
          Surname:
          <Input/>
        </Col>
        <Col span={4}></Col>

        <Col span={4}></Col>
        <Col span={8} >
          Username:
          <Input/>
        </Col>
        <Col span={8}>
          Email:
          <Input/>
        </Col>
        <Col span={4}></Col>

        <Col span={4}></Col>
        <Col span={8} >
          New Password:
          <Input.Password/>
        </Col>
        <Col span={8}>
          Repeat Password:
          <Input.Password/>
        </Col>
        <Col span={4}></Col>

        <Col span={12}></Col>
        <Col span={8}>
          <Button type='primary'>Save</Button>
        </Col>
      </Row>
    </>
  );
};

export default AccountPage;