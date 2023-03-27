import React, { useEffect, useMemo, useState } from 'react';
import { Form, Input, Button, Modal, ModalProps, message, Image } from 'antd';
import { CategoryEditPayload, CategoryPayload } from '../../../api/apipayloads';
import { getImage, updateCategory, uploadCategoryImage } from '../../../api/api';
import { useSessionStorage } from '../../../hooks';
import ImageUploader from '../../images/ImageUploader';

interface Props extends ModalProps {
  sportId: number;
  category: CategoryPayload;
  onSubmit: () => void;
}

const EditCategoryModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, category, sportId }) => {
  const [form] = Form.useForm<CategoryEditPayload>();
  const { sessionStorage } = useSessionStorage();
  const [uploadedImage, setUploadedImage] = useState<FormData>();
  const [image, setImage] = useState<string | null>(null);

  const initialValues = useMemo(() => ({
    name: category.name
  }), [category])

  const handleFormSubmit = async (values: CategoryEditPayload) => {
    try {
      await updateCategory(sessionStorage ? sessionStorage : "", sportId, category.id, values);
      await uploadCategoryImage(sessionStorage ? sessionStorage : "", sportId, category.id, uploadedImage)
      message.success("Updated category!");
      onSubmit();
    } catch (err) {
      console.log(err);
      message.error("Failed to update category!");
    }
  };

  const handleImageUpload = (image: FormData) => {
    setUploadedImage(image);
  }

  const loadImage = async () => {
    if(!open || category.photo == "" || category.photo == null) {
      return;
    }
    try {
      const data = await getImage(sessionStorage ? sessionStorage : "", category.photo);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      }
    } catch(err) {
      console.log(err);
      message.error("Failed to retrieve image!");
    }
  }

  useEffect(() => {
    if(open) {
      loadImage();
    }
  }, [open]);

  return (
    <Modal destroyOnClose
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <div style={{ padding: '16px' }}>
        <h2>
          Edit Sport
        </h2>

        <Form form={form} preserve={false} initialValues={initialValues} onFinish={handleFormSubmit}>
          <Form.Item name="name" rules={[{ required: true, message: 'Missing name for category!' }]}>
            <Input />
          </Form.Item>

          Current picture:
          <div style={{alignItems: 'center'}}>
            <Image
              src={category.photo}
            />
          </div>

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

export default EditCategoryModal;