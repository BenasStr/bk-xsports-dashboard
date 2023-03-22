import React from 'react';
import { Form, Input, Button, message, Modal, ModalProps } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { VariantEditPayload } from '../../../api/apipayloads';
import { createVariant } from '../../../api/api';
import { useSessionStorage } from '../../../hooks';

interface Props extends ModalProps {
    onSubmit: () => void;
}

const AddVariantModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit }) => {

    const [form] = Form.useForm<VariantEditPayload>();
    const { sessionStorage } = useSessionStorage();

    const handleFormSubmit = async (values: VariantEditPayload) => {
        try {
            await createVariant(sessionStorage ? sessionStorage : "", values);
            onSubmit();
            message.success("Created new variant!");
        } catch (err) {
            message.error("Failed to create variant!");
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <div style={{ padding: '16px' }}>
                <h2>
                    Add Variant
                </h2>

                <Form form={form} onFinish={handleFormSubmit}>
                    <Form.Item name="name" rules={[{ required: true, message: 'Missing name for variant tag!' }]}>
                        <Input placeholder='Name' />
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

export default AddVariantModal;