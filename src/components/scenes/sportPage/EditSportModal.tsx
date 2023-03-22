import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, Button, message, List, Checkbox, Modal, ModalProps } from 'antd';
import { SportEditPayload, SportPayload, VariantPayload } from '../../../api/apipayloads';
import { getVariants, updateSport } from '../../../api/api';
import { LoadingOutlined } from '@ant-design/icons';
import { useSessionStorage } from '../../../hooks';
import ImageUploader from '../../images/ImageUploader';

interface Props extends ModalProps {
  sport: SportPayload;
  onSubmit: () => void;
}

const EditSportModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, sport }) => {
  const [form] = Form.useForm<SportEditPayload>();
  const { sessionStorage } = useSessionStorage();
  const [variants, setVariants] = useState<VariantPayload[]>([]);

  const initialValues = useMemo(() => ({
    name: sport.name,
    variantsIds: sport.variants.map((variant) => variant.id)
  }), [sport])

  const getVariantsData = async () => {
    try {
      const data: VariantPayload[] = await getVariants(sessionStorage ? sessionStorage : "");
      data.forEach((variant) => {
        if (variant.name === "Standard") {
          data.splice(data.indexOf(variant), 1)
        }
      });
      setVariants(data);
    } catch (err) {
      message.error("Failed to retrieve variants!");
    }
  }

  const handleFormSubmit = async (values: SportEditPayload) => {
    try {
      await updateSport(sessionStorage ? sessionStorage : "", sport.id, values);
      message.success("Updated sport!");
      onSubmit();
    } catch (err) {
      message.error("Failed to update sport!");
    }
  };

  useEffect(() => {
    getVariantsData();
  }, []);

  return (!variants ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :

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
          <Form.Item name="name" rules={[{ required: true, message: 'Missing name for sport!' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="photoUrl">
            <ImageUploader></ImageUploader>
          </Form.Item>

          <Form.Item label="Variants" name="variantsIds">
            <Checkbox.Group >
              <List>
                {variants.map((variant) => {
                  return (
                    <List.Item>
                      <Checkbox key={variant.id} value={variant.id}>{variant.name}</Checkbox>
                    </List.Item>
                  );
                })}
              </List>
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

export default EditSportModal;