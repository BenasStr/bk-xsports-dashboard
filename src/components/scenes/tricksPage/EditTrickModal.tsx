import React, { useState, useMemo, useCallback } from 'react';
import { Form, Input, Button, message, Modal, ModalProps, Radio, Space, Select, RadioChangeEvent, SelectProps, Card, Popconfirm } from 'antd';
import { DifficultyPayload, SportEditPayload, TrickEditPayload, TrickPayload } from '../../../api/apipayloads';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { useSessionStorage } from '../../../hooks';
import TextArea from 'antd/es/input/TextArea';
import { DefaultOptionType } from 'antd/es/select';
import { updateTrick, uploadVideo } from '../../../api/xsports/tricksApi';
import VideoUploader from '../../videos/videoUploader';
import { RcFile } from 'antd/es/upload';

interface Props extends ModalProps {
  sportId: number;
  categoryId: number;
  tricks: TrickPayload[];
  trickEdit: TrickPayload;
  difficulties: DifficultyPayload[];
  onSubmit: () => void;
}

const EditTrickModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, sportId, categoryId, tricks, trickEdit, difficulties }) => {
  const [form] = Form.useForm<TrickEditPayload>();
  const { sessionStorage } = useSessionStorage();
  const [difficulty, setDifficulty] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(true);
  const [video, setVideo] = useState<RcFile>();

  const initialValues = useMemo(() => ({
    name: trickEdit.name,
    description: trickEdit.description,
    shortDescription: trickEdit.shortDescription,
    difficultyId: (difficulties.find(d => d.name === trickEdit.difficulty))?.id
  }), [trickEdit])

  const handleFormSubmit = async (values: TrickEditPayload) => {
    try {
      const trick: TrickPayload = await updateTrick(sessionStorage ? sessionStorage : "", sportId, categoryId, trickEdit.id, values);
      if (video != null) {
        await uploadVideo(sessionStorage?sessionStorage:"", sportId, categoryId, trick.id, video);
      }
      message.success("Updated trick!");
      onSubmit();
    } catch (err) {
      message.error("Failed to update trick!");
    }
  };

  const handleChange = (value: string | string[]) => {
    console.log(`selected ${value}`);
  };

  const filterOption = (input: string, option: any) => {
    return option.label.includes(input);
  }

  const mapToSelectProps = (): SelectProps["options"] => {
    return tricks.filter(trick => trick.id !== trickEdit.id)
    .map((trick) => {
      return {
        value: trick.id,
        label: trick.name
      }
    });
  }

  const mapToDefaultProps = (): DefaultOptionType["options"] => {
    return trickEdit.trickParents
      .map((trick) => {
        return {
          value: trick.id,
          label: trick.name
        }
      })
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
      {!tricks ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
        <div style={{ padding: '16px' }}>
          <h2>
            Edit Trick
          </h2>

          <Form form={form} preserve={false} initialValues={initialValues} onFinish={handleFormSubmit}>
            <Form.Item name="name" rules={[{ required: true, message: 'Missing name for trick!' }]}>
              <Input placeholder='Name' />
            </Form.Item>

            {
              videoError ? 
                <Card>
                  <p>Video not found!</p> 
                </Card> :
                <video width="100%" height="auto" controls>
                  <source src={trickEdit.video} type="video/mp4" />
                </video>
            }

            <Form.Item name="video">
              <VideoUploader onUplaod={handleVidoeUpload}></VideoUploader>
            </Form.Item>

            Difficulty:
            <Form.Item name="difficultyId" rules={[{ required: true, message: 'Missing difficulty!' }]}>
              <Radio.Group defaultValue={initialValues.difficultyId}>
                <Space direction='vertical' onChange={onChange} value={difficulty}>
                  {difficulties.map(difficulty => (
                    <Radio key={difficulty.id} value={difficulty.id}>{difficulty.name}</Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="shortDescription" rules={[{ required: true, message: 'Missing short description for trick!' }]}>
              <TextArea placeholder='Short Description' rows={4} maxLength={100} />
            </Form.Item>

            <Form.Item name="description" rules={[{ required: true, message: 'Missing description for trick!' }]}>
              <TextArea placeholder='Description' rows={8} maxLength={250} />
            </Form.Item>

            Select Trick Parents:
            <Form.Item name="trickParentsIds">
              <Select
                mode="multiple"
                placeholder="Please select"
                onChange={handleChange}
                filterOption={filterOption}
                defaultValue={mapToDefaultProps()}
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

export default EditTrickModal;