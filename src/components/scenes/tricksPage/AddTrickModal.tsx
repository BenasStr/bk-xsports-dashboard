import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Input, Button, Modal, ModalProps, Radio, Space, RadioChangeEvent, Transfer, Select, Spin } from 'antd';
import { DifficultyPayload, TrickBasicPayload, TrickEditPayload, TrickPayload } from '../../../api/apipayloads';
import { createTrick, getDifficulties, getTricksByVariants} from '../../../api/api';
import { useSessionStorage } from '../../../hooks';
import TextArea from 'antd/es/input/TextArea';
import { SelectProps } from 'rc-select';
import { LoadingOutlined } from '@ant-design/icons';

interface Props extends ModalProps {
    sportId: number;
    categoryId: number;
    tricks: TrickPayload[];
    difficulties: DifficultyPayload[];
    onSubmit: () => void;
}

const AddTrickModal: React.FunctionComponent<Props> = ({open, onCancel, onSubmit, sportId, categoryId, tricks, difficulties}) => {
  const [form] = Form.useForm<TrickEditPayload>();
  const [difficulty, setDifficulty] = useState(0);
  const {sessionStorage} = useSessionStorage();

  const handleFormSubmit = async (values: TrickEditPayload) => {
    try {
      await createTrick(sessionStorage?sessionStorage:"", sportId, categoryId, values);
      onSubmit()
    } catch (err) {
      console.log("Failed to create trick") 
    }
  };

  const handleChange = (value: string | string[]) => {
    console.log(`selected ${value}`);
  };

  const filterOption = (input: string, option: any) => {
    return option.label.includes(input);
  }

  const mapToSelectProps = (): SelectProps["options"] => {
    return tricks.map((trick) => {
      return {
        value: trick.id,
        label: trick.name
      }});
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
      <div style={{padding: '16px'}}>
      <h2>
        Add Trick
      </h2>  

        <Form form={form} onFinish={handleFormSubmit}>
        <Form.Item name="name" rules={[{ required: true, message: 'Missing name for trick!' }]}>
          <Input placeholder='Name'/>
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

        <Form.Item name="shortDescription" rules={[{ required: true, message: 'Missing short description for trick!' }]}>
          <TextArea placeholder='Short Description' rows={4} maxLength={100}/>
        </Form.Item>

        <Form.Item name="description" rules={[{ required: true, message: 'Missing description for trick!' }]}>
          <TextArea placeholder='Description' rows={8} maxLength={250}/>
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

export default AddTrickModal;