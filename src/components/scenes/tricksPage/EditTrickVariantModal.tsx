import React, { useState, useMemo } from 'react';
import { Form, Button, message, Modal, ModalProps, Select, SelectProps, Card } from 'antd';
import { TrickBasicPayload, TrickEditPayload, TrickPayload, TrickVariantEditPayload, VariantPayload } from '../../../api/apipayloads';
import { LoadingOutlined } from '@ant-design/icons';
import { useSessionStorage } from '../../../hooks';
import TextArea from 'antd/es/input/TextArea';
import VideoUploader from '../../videos/videoUploader';
import { RcFile } from 'antd/es/upload';
import { updateTrickVariant, uploadVideo } from '../../../api/xsports/tricksApi';

interface Props extends ModalProps {
  trickVariant: TrickBasicPayload;
  trick: TrickPayload;
  sportId: number;
  categoryId: number;
  onSubmit: () => void;
}

const EditTrickVariantModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, sportId, categoryId, trick, trickVariant }) => {
  const [form] = Form.useForm<TrickVariantEditPayload>();
  const { sessionStorage } = useSessionStorage();
  const [video, setVideo] = useState<RcFile>();
  const initialValues = useMemo(() => ({
    shortDescription: trickVariant.shortDescription,
    description: trickVariant.description,
  }), [trickVariant])

  const handleFormSubmit = async (values: TrickVariantEditPayload) => {
    try {
      values.variantId = trickVariant.variantId;
      await updateTrickVariant(sessionStorage ? sessionStorage : "", sportId, categoryId, trick.trickId, trickVariant.id, values);
      if (video != null) {
        await uploadVideo(sessionStorage?sessionStorage:"", sportId, categoryId, trickVariant.id, video);
      } 
      message.success("Updated trick variant!");
      onSubmit();
    } catch (err) {
      message.error("Failed to update trick variant!");
    }
  };

  const handleVidoeUpload = (file: RcFile) => {
    setVideo(file);
  }

  return (
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

          {
            trickVariant.videoUrl == null ? 
              <Card>
                <p>Video not found!</p> 
              </Card> :
              <video width="100%" height="auto" controls>
                <source src={trick.videoUrl} type="video/mp4" />
              </video>
          }

          <Form.Item name="video">
            <VideoUploader onUplaod={handleVidoeUpload}></VideoUploader>
          </Form.Item>

          <Form.Item name="shortDescription" rules={[{ required: true, message: 'Missing short description for trick!' }]}>
            <TextArea placeholder='Short Description' rows={4} maxLength={100} />
          </Form.Item>

          <Form.Item name="description" rules={[{ required: true, message: 'Missing description for trick!' }]}>
            <TextArea placeholder='Description' rows={8} maxLength={250} />
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