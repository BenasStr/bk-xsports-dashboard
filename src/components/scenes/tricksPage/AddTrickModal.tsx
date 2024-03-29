import React, { useMemo, useState } from 'react';
import { Form, Input, Button, Modal, ModalProps, Radio, Space, RadioChangeEvent, Select, message } from 'antd';
import { DifficultyPayload, TrickEditPayload, TrickPayload } from '../../../api/apipayloads';
import { createTrick, uploadVideo } from '../../../api/xsports/tricksApi';
import { useSessionStorage } from '../../../hooks';
import TextArea from 'antd/es/input/TextArea';
import { SelectProps } from 'rc-select';
import { LoadingOutlined } from '@ant-design/icons';
import VideoUploader from '../../videos/videoUploader';
import { RcFile } from 'antd/es/upload';

interface Props extends ModalProps {
  sportId: number;
  categoryId: number;
  tricks: TrickPayload[];
  difficulties: DifficultyPayload[];
  onSubmit: () => void;
}

const AddTrickModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, sportId, categoryId, tricks, difficulties }) => {
  const [form] = Form.useForm<TrickEditPayload>();
  const [difficulty, setDifficulty] = useState(0);
  const { sessionStorage } = useSessionStorage();
  const [video, setVideo] = useState<RcFile>();
  const [videoIsUploading, setVideoIsUploading] = useState<boolean>(false);

  const initialValues = useMemo(() => ({
    trickParentsIds: []
  }), [])

  const handleFormSubmit = async (values: TrickEditPayload) => {
    try {
      const trick: TrickPayload = await createTrick(sessionStorage ? sessionStorage : "", sportId, categoryId, values);
      if (video != null) {
        setVideoIsUploading(true);
        await uploadVideo(sessionStorage ? sessionStorage : "", sportId, categoryId, trick.id, video);
      }
      onSubmit();
    } catch (err) {
      console.log(err);
      message.error("Failed to create trick!");
    }
    setVideoIsUploading(false)
  };

  const filterOption = (input: string, option: any) => {
    return option.label.includes(input);
  }

  const mapToSelectProps = (): SelectProps["options"] => {
    return tricks.map((trick) => {
      return {
        value: trick.trickId,
        label: trick.name
      }
    });
  }

  const onChange = (e: RadioChangeEvent) => {
    setDifficulty(e.target.value);
  };

  const handleVidoeUpload = (file: RcFile) => {
    setVideo(file);
  }

  return (

      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        destroyOnClose
      >
        {videoIsUploading ?
          <div>
            <LoadingOutlined style={{ fontSize: 48 }} spin />
            <div>
              Uploading video...
            </div>
          </div>:

          <div style={{ padding: '16px' }}>
            <h2>
              Add Trick
            </h2>

            <Form form={form} initialValues={initialValues} onFinish={handleFormSubmit}>
              <Form.Item name="name" rules={[{ required: true, message: 'Missing name!' }]}>
                <Input placeholder='Name' />
              </Form.Item>

              <Form.Item name="video">
                <VideoUploader onUplaod={handleVidoeUpload}></VideoUploader>
              </Form.Item>

              Difficulty:
              <Form.Item name="difficultyId" rules={[{ required: true, message: 'Missing difficulty!' }]}>
                <Radio.Group>
                  <Space direction='vertical' onChange={onChange} value={difficulty}>
                    {difficulties.map(difficulty => (
                      <Radio key={difficulty.id} value={difficulty.id}>{difficulty.name}</Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="shortDescription" rules={[{ required: true, message: 'Missing short description!' }]}>
                <TextArea placeholder='Short Description' rows={4} maxLength={100} />
              </Form.Item>

              <Form.Item name="description" rules={[{ required: true, message: 'Missing description!' }]}>
                <TextArea placeholder='Description' rows={8} maxLength={250} />
              </Form.Item>

              Select Trick Parents:
              <Form.Item name="trickParentsIds">
                <Select
                  mode="multiple"
                  placeholder="Please select"
                  filterOption={filterOption}
                  options={mapToSelectProps()}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>}
      </Modal>
  );
};

export default AddTrickModal;