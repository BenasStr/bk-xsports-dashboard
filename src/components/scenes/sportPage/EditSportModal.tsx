import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, Button, message, List, Checkbox, Modal, ModalProps, Image } from 'antd';
import { SportEditPayload, SportPayload, VariantPayload } from '../../../api/apipayloads';
import { updateSport, uploadSportImage } from '../../../api/xsports/sportsApi';
import { getVariants } from '../../../api/xsports/variantsApi';
import { LoadingOutlined } from '@ant-design/icons';
import { useSessionStorage } from '../../../hooks';
import ImageUploader from '../../images/ImageUploader';

interface Props extends ModalProps {
  sport: SportPayload;
  onSubmit: () => void;
}

const EditSportModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, sport }) => {
  console.log(sport)
  const [form] = Form.useForm<SportEditPayload>();
  const { sessionStorage } = useSessionStorage();
  const [variants, setVariants] = useState<VariantPayload[]>([]);
  const [uploadedImage, setUploadedImage] = useState<FormData>();

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

  const handleImageUpload = (image: FormData) => {
    setUploadedImage(image);
  }

  const handleFormSubmit = async (values: SportEditPayload) => {
    try {
      await updateSport(sessionStorage ? sessionStorage : "", sport.id, values);
      console.log(uploadedImage);
      if (uploadedImage != null) {
        await uploadSportImage(sessionStorage ? sessionStorage : "", sport.id, uploadedImage)
      }
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

          Current picture:
          <div style={{alignItems: 'center'}}>
            <Image
              src={sport.photo}
            />
          </div>

          <Form.Item name="photoUrl">
            <ImageUploader onUplaod={handleImageUpload}></ImageUploader>
          </Form.Item>

          Variants:
          <Form.Item name="variantsIds">
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