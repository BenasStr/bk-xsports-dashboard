import React, { useState, useMemo } from 'react';
import { Form, Input, Button, message, Modal, ModalProps, Radio, Space, Select, RadioChangeEvent, SelectProps } from 'antd';
import { DifficultyPayload, SportEditPayload, TrickPayload } from '../../../api/apipayloads';
import { LoadingOutlined } from '@ant-design/icons';
import { useSessionStorage } from '../../../hooks';
import TextArea from 'antd/es/input/TextArea';

interface Props extends ModalProps {
  sportId: number;
  categoryId: number;
  tricks: TrickPayload[];
  trickEdit: TrickPayload;
  difficulties: DifficultyPayload[];
  onSubmit: () => void;
}

const EditTrickModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, sportId, categoryId, tricks, trickEdit, difficulties }) => {
  const [form] = Form.useForm<SportEditPayload>();
  const { sessionStorage } = useSessionStorage();
  const [difficulty, setDifficulty] = useState(0);

  const initialValues = useMemo(() => ({
    name: trickEdit.name,
    description: trickEdit.description,
    shortDescription: trickEdit.shortDescription,
    difficultyId: (difficulties.find(d => d.name === trickEdit.difficulty))?.id
  }), [trickEdit])

  const handleFormSubmit = async (values: SportEditPayload) => {
    try {
      //   await updateSport(sessionStorage ? sessionStorage : "", sport.id, values);
      message.success("Updated sport!");
      onSubmit();
    } catch (err) {
      message.error("Failed to update sport!");
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

  const onChange = (e: RadioChangeEvent) => {
    setDifficulty(e.target.value);
  };

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
            <Form.Item name="parentsIds">
              <Select
                mode="multiple"
                placeholder="Please select"
                onChange={handleChange}
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

export default EditTrickModal;