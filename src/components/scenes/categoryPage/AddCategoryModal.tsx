import React from 'react';
import { Form, Input, Button, Modal, ModalProps, message } from 'antd';
import { CategoryEditPayload } from '../../../api/apipayloads';
import { createCategory } from '../../../api/api';
import { useSessionStorage } from '../../../hooks';

interface Props extends ModalProps {
  sportId: number
  onSubmit: () => void;
}

const AddCategoryModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, sportId }) => {
  const [form] = Form.useForm<CategoryEditPayload>();
  const { sessionStorage } = useSessionStorage();

  const handleFormSubmit = async (values: CategoryEditPayload) => {
    try {
      await createCategory(sessionStorage ? sessionStorage : "", sportId, values);
      message.success("Created new category!");
      onSubmit()
    } catch (err) {
      message.error("Failed to create category!");
    }
  };

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