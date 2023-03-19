import React, { useMemo } from 'react';
import { Form, Input, Button, Modal, ModalProps } from 'antd';
import { CategoryEditPayload, CategoryPayload } from '../../../api/apipayloads';
import { updateCategory } from '../../../api/api';
import { useSessionStorage } from '../../../hooks';

interface Props extends ModalProps {
    sportId: number;
    category: CategoryPayload;
    onSubmit: () => void;
}

const EditCategoryModal: React.FunctionComponent<Props> = ({open, onCancel, onSubmit, category, sportId}) => {
  const [form] = Form.useForm<CategoryEditPayload>();
  const {sessionStorage} = useSessionStorage();

  const initialValues = useMemo(() => ({
    name: category.name
  }), [category])

  const handleFormSubmit = async (values: CategoryEditPayload) => {
    try {
      await updateCategory(sessionStorage?sessionStorage:"", sportId, category.id, values);
      onSubmit()
    } catch (err) {
      console.log("Failed to create sport") 
    }
  };

  return (
    <Modal destroyOnClose
          open={open}
          onCancel={onCancel}
          footer={null}
        > 
      <div style={{padding: '16px'}}>
      <h2>
        Edit Sport
      </h2>  

        <Form form={form} preserve={false} initialValues={initialValues} onFinish={handleFormSubmit}>
        <Form.Item name="name" rules={[{ required: true, message: 'Missing name for sport!' }]}>
          <Input />
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