import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Modal, ModalProps, Radio, Space, RadioChangeEvent } from 'antd';
import { DifficultyPayload, TrickBasicPayload, TrickEditPayload } from '../../../api/apipayloads';
import { createTrick, getDifficulties, getTricks} from '../../../api/api';
import { useSessionStorage } from '../../../hooks';
import TextArea from 'antd/es/input/TextArea';

interface Props extends ModalProps {
    sportId: number;
    categoryId: number;
    onSubmit: () => void;
}

const AddTrickModal: React.FunctionComponent<Props> = ({open, onCancel, onSubmit, sportId, categoryId}) => {
  const [form] = Form.useForm<TrickEditPayload>();
  const [difficulties, setDifficulties] = useState<DifficultyPayload[]>([]);
  const [difficulty, setDifficulty] = useState(0);
  const [tricks, setTricks] = useState<TrickBasicPayload[]>([]);
  const {sessionStorage} = useSessionStorage();

  const handleFormSubmit = async (values: TrickEditPayload) => {
    try {
      await createTrick(sessionStorage?sessionStorage:"", sportId, categoryId, values);
      onSubmit()
    } catch (err) {
      console.log("Failed to create category") 
    }
  };

  const getDifficultiesData = async () => {
    try {
      const data: DifficultyPayload[] = await getDifficulties(sessionStorage?sessionStorage:"");
      setDifficulties(data);
    } catch (err) {
      console.log("Failed to reterieve difficulties");
    }
  }

  const getTricksData = async () => {
    try {
      const data: TrickBasicPayload[] = await getTricks(sessionStorage?sessionStorage:"", 1, 1, "Standard");
      setTricks(data);
    } catch (err) {
      console.log("Failed to retrieve tricks");
    }
  }

  const onChange = (e: RadioChangeEvent) => {
    setDifficulty(e.target.value);
  };

  useEffect(() => {
    getDifficultiesData()
    getTricksData()
  }, []);

  return ( 
    <Modal
          open={open}
          onCancel={onCancel}
          footer={null}
        > 
      <div style={{padding: '16px'}}>
      <h2>
        Add Trick
      </h2>  

        <Form form={form} onFinish={handleFormSubmit}>
        <Form.Item name="name" rules={[{ required: true, message: 'Missing name for trick!' }]}>
          <Input placeholder='Name'/>
        </Form.Item>

        <Form.Item label="Difficulty">
            <Radio.Group>
                <Space direction='vertical' onChange={onChange} value={difficulty}>
                  {difficulties.map(difficulty => (
                    <Radio key={difficulty.id} value={difficulty.id}>{difficulty.name}</Radio>
                  ))}
                </Space>
            </Radio.Group> 
        </Form.Item>

        <Form.Item name="shortDescription" rules={[{ required: true, message: 'Missing short description for trick!' }]}>
            <TextArea placeholder='Short Description' rows={4}/>
        </Form.Item>

        <Form.Item name="description" rules={[{ required: true, message: 'Missing description for trick!' }]}>
            <TextArea placeholder='Description' rows={8}/>
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

export default AddTrickModal;