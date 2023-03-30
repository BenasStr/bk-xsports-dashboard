import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, Button, message, List, Checkbox, Modal, ModalProps, Image, Select, SelectProps } from 'antd';
import { SportEditPayload, SportPayload, TrickBasicPayload, TrickEditPayload, TrickPayload, TrickVariantEditPayload, VariantPayload } from '../../../api/apipayloads';
import { getImage, getVariants, updateSport, uploadSportImage } from '../../../api/api';
import { LoadingOutlined } from '@ant-design/icons';
import { useSessionStorage } from '../../../hooks';
import ImageUploader from '../../images/ImageUploader';
import TextArea from 'antd/es/input/TextArea';

interface Props extends ModalProps {
  trick: TrickPayload;
  sportId: number;
  categoryId: number;
  variants: VariantPayload[];
  onSubmit: () => void;
}

const EditTrickVariantModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, sportId, categoryId, trick, variants}) => {
  console.log(trick);
  const [form] = Form.useForm<SportEditPayload>();
  const { sessionStorage } = useSessionStorage();
  const initialValues = useMemo(() => ({
    name: trick.name,
    shortDescription: trick.shortDescription,
    description: trick.description,
  }), [trick])

  const handleFormSubmit = async (values: SportEditPayload) => {
    try {
      //   await updateSport(sessionStorage ? sessionStorage : "", sport.id, values);
      message.success("Updated sport!");
      onSubmit();
    } catch (err) {
      message.error("Failed to update sport!");
    }
  };



  const mapToSelectProps = (): SelectProps["options"] => {
    return variants.map((variant) => {
      return {
        value: variant.id,
        label: variant.name
      }
    });
  }

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

        <Form form={form} initialValues={initialValues} onFinish={handleFormSubmit}>
          <Form.Item name="shortDescription" rules={[{ required: true, message: 'Missing short description for trick!' }]}>
            <TextArea placeholder='Short Description' rows={4} maxLength={100} />
          </Form.Item>

          <Form.Item name="description" rules={[{ required: true, message: 'Missing description for trick!' }]}>
            <TextArea placeholder='Description' rows={8} maxLength={250} />
          </Form.Item>

          <Form.Item name="variantId">
            <Select
              placeholder="Please select variant"
              options={mapToSelectProps()}
            />
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