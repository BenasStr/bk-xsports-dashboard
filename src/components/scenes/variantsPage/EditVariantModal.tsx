import React from 'react';
import { Form, Input, Button, message, Modal, ModalProps } from 'antd';
import { SportEditPayload, VariantEditPayload, VariantPayload } from '../../../api/apipayloads';
import { updateVariant } from '../../../api/xsports/variantsApi';
import { useSessionStorage } from '../../../hooks';

interface Props extends ModalProps {
    variant: VariantPayload
    onSubmit: () => void;
}

const EditVariantModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, variant }) => {
    const [form] = Form.useForm<SportEditPayload>();
    const { sessionStorage } = useSessionStorage();

    const handleFormSubmit = async (values: VariantEditPayload) => {
        try {
            await updateVariant(sessionStorage ? sessionStorage : "", variant.id, values);
            message.success("Updated variant!")
            onSubmit()
        } catch (err) {
            message.error("Failed to edit variant!");
        }
    };

    return (
        <Modal destroyOnClose
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <div style={{ padding: '16px' }}>
                <h2>
                    Edit Variant
                </h2>

                <Form form={form} preserve={false} initialValues={variant} onFinish={handleFormSubmit}>
                    <Form.Item name="name" rules={[{ required: true, message: 'Missing name for sport!' }]}>
                        <Input />
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

export default EditVariantModal;