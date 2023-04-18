import React, { useEffect } from 'react';
import { Form, Input, Button, message, Modal, ModalProps, DatePicker, Select, SelectProps } from 'antd';
import { PublishAvailableCategoriesPayload, PublishEditPayload, PublishPublishPayload } from '../../../api/apipayloads';
import { useSessionStorage } from '../../../hooks';
import { createPublish, publish } from '../../../api/xsports/publichApi';
import moment, { Moment } from 'moment';

interface Props extends ModalProps {
    onSubmit: () => void;
    categories: PublishAvailableCategoriesPayload[]
}

interface Payload {
    categoryId: number
}

const PublishModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, categories }) => {
    const [form] = Form.useForm<Payload>();
    const { sessionStorage } = useSessionStorage();

    const handleFormSubmit = async (values: Payload) => {
        try {
            await publish(sessionStorage?sessionStorage:"", getSportIdByCategoryId(categories, values.categoryId), values.categoryId)
            onSubmit();
        } catch (err) {
            console.log(err);
            message.error("Failed to publish!")
        }
    };

    const getSportIdByCategoryId = (categories: PublishAvailableCategoriesPayload[], categoryId: number) => {
        const sport = categories.filter((sport) => 
            sport.category.filter((category) => 
                category.id == categoryId
            ).length > 0
        );
        return sport[0].id;
    }

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
            }
        });
    }

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <div style={{ padding: '16px' }}>
                <h2>
                    Publish
                </h2>

                <Form form={form} onFinish={handleFormSubmit}>

                    <Form.Item name="categoryId">
                        <Select options={mapToOptions()} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Publish
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default PublishModal;