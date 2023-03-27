import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, Button, message, List, Checkbox, Modal, ModalProps, Image } from 'antd';
import { SportEditPayload, SportPayload, TrickEditPayload, VariantPayload } from '../../../api/apipayloads';
import { getImage, getVariants, updateSport, uploadSportImage } from '../../../api/api';
import { LoadingOutlined } from '@ant-design/icons';
import { useSessionStorage } from '../../../hooks';
import ImageUploader from '../../images/ImageUploader';

interface Props extends ModalProps {
  trick: TrickEditPayload;
  onSubmit: () => void;
}

const EditTrickVariantModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, trick }) => {
  console.log(trick)
  const [form] = Form.useForm<SportEditPayload>();
  const { sessionStorage } = useSessionStorage();
  const [variants, setVariants] = useState<VariantPayload[]>([]);

  const handleFormSubmit = async (values: SportEditPayload) => {
    try {
    //   await updateSport(sessionStorage ? sessionStorage : "", sport.id, values);
      message.success("Updated sport!");
      onSubmit();
    } catch (err) {
      message.error("Failed to update sport!");
    }
  };

  useEffect(() => {

  }, []);

  return (!variants ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :

    <Modal destroyOnClose
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <div style={{ padding: '16px' }}>
        <h2>
          Edit Trick Variant
        </h2>

        <Form form={form} preserve={false} onFinish={handleFormSubmit}>
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

export default EditTrickVariantModal;