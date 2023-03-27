import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, List, Checkbox, Modal, ModalProps } from 'antd';
import { SportEditPayload, VariantPayload } from '../../../api/apipayloads';
import { createSport, getVariants, uploadSportImage } from '../../../api/api';
import { LoadingOutlined } from '@ant-design/icons';
import { useSessionStorage } from '../../../hooks';
import ImageUploader from '../../images/ImageUploader';

interface Props extends ModalProps {
  onSubmit: () => void;
}

const AddSportModal: React.FunctionComponent<Props> = ({open, onCancel, onSubmit}) => {
  const [form] = Form.useForm<SportEditPayload>();
  const {sessionStorage} = useSessionStorage();
  const [variants, setVariants] = useState<VariantPayload[]>([]);
  const [uploadedImage, setUploadedImage] = useState<FormData>();

  const getVariantsData = async () => {
    try {
      const data: VariantPayload[] = await getVariants(sessionStorage?sessionStorage:"");
      data.forEach((variant) => {
        if (variant.name === "Standard") {
          data.splice(data.indexOf(variant), 1)
        }
      });
      setVariants(data);
    } catch (err) {
      message.error("Failed to reterieve variants!")
    }
  }

  const handleFormSubmit = async (values: SportEditPayload) => {
    try {
      const addedSport = await createSport(sessionStorage?sessionStorage:"", values);
      if (uploadedImage != null) {
        await uploadSportImage(sessionStorage ? sessionStorage : "", addedSport.id, uploadedImage)
      }
      onSubmit()
    } catch (err) {
      message.error("Failed to create sport!")
    }
  };

  const handleImageUpload = (image: FormData) => {
    setUploadedImage(image);
  }

  useEffect(() => {
    getVariantsData();
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

        <Form.Item name="photoUrl">
          <ImageUploader onUplaod={handleImageUpload}></ImageUploader>
        </Form.Item>

        <Form.Item label="Variants" name="variantsIds">
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