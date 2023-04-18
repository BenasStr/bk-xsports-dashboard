import React, { useState } from 'react';
import { Form, Input, Button, Modal, ModalProps, message } from 'antd';
import { CategoryEditPayload } from '../../../api/apipayloads';
import { createCategory, uploadCategoryImage } from '../../../api/xsports/categoriesApi';
import { useSessionStorage } from '../../../hooks';
import ImageUploader from '../../images/ImageUploader';

interface Props extends ModalProps {
  sportId: number
  onSubmit: () => void;
}

const AddCategoryModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, sportId }) => {
  const [form] = Form.useForm<CategoryEditPayload>();
  const { sessionStorage } = useSessionStorage();
  const [uploadedImage, setUploadedImage] = useState<FormData>();

  const handleFormSubmit = async (values: CategoryEditPayload) => {
    try {
      const createdCategory = await createCategory(sessionStorage ? sessionStorage : "", sportId, values);
      if (uploadedImage == null) {
        await uploadCategoryImage(sessionStorage ? sessionStorage : "", sportId, createdCategory.id, uploadedImage);
      }
      message.success("Created new category!");
      onSubmit()
    } catch (err) {
      message.error("Failed to create category!");
    }
  };

  const handleImageUpload = (image: FormData) => {
    setUploadedImage(image);
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <div style={{ padding: '16px' }}>
        <h2>
          Add Sport
        </h2>

        <Form form={form} onFinish={handleFormSubmit}>
          <Form.Item name="name" rules={[{ required: true, message: 'Missing name for category!' }]}>
            <Input placeholder='Name' />
          </Form.Item>

          <Form.Item name="photoUrl">
            <ImageUploader onUplaod={handleImageUpload}></ImageUploader>
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

export default AddCategoryModal;