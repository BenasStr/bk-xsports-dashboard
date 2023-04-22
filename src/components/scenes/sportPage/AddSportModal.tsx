import React, { useState } from 'react';
import { Form, Input, Button, message, List, Checkbox, Modal, ModalProps } from 'antd';
import { SportEditPayload, VariantPayload } from '../../../api/apipayloads';
import { createSport, uploadSportImage } from '../../../api/xsports/sportsApi';
import { LoadingOutlined } from '@ant-design/icons';
import { useSessionStorage } from '../../../hooks';
import ImageUploader from '../../images/ImageUploader';

interface Props extends ModalProps {
  variants: VariantPayload[]
  onSubmit: () => void;
}

const AddSportModal: React.FunctionComponent<Props> = ({open, onCancel, onSubmit, variants}) => {
  const [form] = Form.useForm<SportEditPayload>();
  const {sessionStorage} = useSessionStorage();
  const [uploadedImage, setUploadedImage] = useState<FormData>();

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