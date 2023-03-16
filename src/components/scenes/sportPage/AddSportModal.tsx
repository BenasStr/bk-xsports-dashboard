import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, List, Checkbox, Modal, ModalProps } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { SportEditPayload, SportPayload, VariantPayload } from '../../../api/apipayloads';
import { createSport, getVariants, updateSport } from '../../../api/api';
import { LoadingOutlined } from '@ant-design/icons';
import { useSessionStorage } from '../../../hooks';

interface Props extends ModalProps {
    onSubmit: () => void;
}

const AddSportModal: React.FunctionComponent<Props> = ({open, onCancel, onSubmit}) => {
  const [form] = Form.useForm<SportEditPayload>();
  const {sessionStorage} = useSessionStorage();
  const [variants, setVariants] = useState<VariantPayload[]>([]);
  const [standardVariantId, setStandardVariantId] = useState<number>(-1);

  const getVariantsData = async () => {
    try {
      const data: VariantPayload[] = await getVariants(sessionStorage?sessionStorage:"");
      data.forEach((variant) => {
        if (variant.name === "Standard") {
          setStandardVariantId(variant.id);
          data.splice(data.indexOf(variant), 1)
        }
      });
      setVariants(data)
    } catch (err) {
      console.log("Failed to reterieve variants")
    }
  }

  const handleFormSubmit = async (values: SportEditPayload) => {
    try {
      console.log(values);
      await createSport(sessionStorage?sessionStorage:"", values);
      onSubmit()
    } catch (err) {
      console.log("Failed to create sport") 
    }
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
  }, []);

  return ( !variants ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :

    <Modal
          open={open}
          onCancel={onCancel}
          footer={null}
        > 
      <div style={{padding: '16px'}}>
      <h2>
        Add Sport
      </h2>  

        <Form form={form} onFinish={handleFormSubmit}>
        <Form.Item name="name" rules={[{ required: true, message: 'Missing name for sport!' }]}>
          <Input placeholder='Name'/>
        </Form.Item>

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
    </Modal>
  );
};

export default AddSportModal;