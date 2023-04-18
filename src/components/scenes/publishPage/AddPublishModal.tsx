import React, { useEffect } from 'react';
import { Form, Input, Button, message, Modal, ModalProps, DatePicker, Select, SelectProps } from 'antd';
import { PublishAvailableCategoriesPayload, PublishEditPayload } from '../../../api/apipayloads';
import { useSessionStorage } from '../../../hooks';
import { createPublish } from '../../../api/xsports/publichApi';
import moment, { Moment } from 'moment';

interface Props extends ModalProps {
  onSubmit: () => void;
  categories: PublishAvailableCategoriesPayload[]
}

const AddPublishModal: React.FunctionComponent<Props> = ({open, onCancel, onSubmit, categories}) => {
  const [form] = Form.useForm<PublishEditPayload>();
  const {sessionStorage} = useSessionStorage();

  const handleFormSubmit = async (values: PublishEditPayload) => {
    try {
      const addedPublish = await createPublish(sessionStorage?sessionStorage:"", values);
      onSubmit()
    } catch (err) {
      message.error("Failed to create publish!")
    }
  };

  const disabledDate = (current: Moment | null) => {
    return current && current < moment().startOf('day');
  };

  const mapToOptions = (): SelectProps["options"] => {
    return categories.map((sport) => {
      return {
        label: sport.name,
        options: sport.category.map((category) => {
          return {
            label: category.name,
            value: category.id
          }
        })
      }});
  }

  return (
    <Modal
          open={open}
          onCancel={onCancel}
          footer={null}
        > 
      <div style={{padding: '16px'}}>
      <h2>
        Add Publish
      </h2>  

        <Form form={form} onFinish={handleFormSubmit}>
        

        <Form.Item name="categoryId">
          <Select options={mapToOptions()}/>
        </Form.Item>

        Release Date:
        <Form.Item name="releaseDate">
          <DatePicker format={"YYYY-MM-DD"} disabledDate={disabledDate}/>
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

export default AddPublishModal;