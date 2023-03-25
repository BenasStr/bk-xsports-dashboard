import React from 'react';
import { Form, Input, Button, Modal, ModalProps, Select, message, SelectProps } from 'antd';
import { TrickVariantEditPayload, VariantPayload } from '../../../api/apipayloads';
import { createTrickVariant } from '../../../api/api';
import { useSessionStorage } from '../../../hooks';
import TextArea from 'antd/es/input/TextArea';
import { LoadingOutlined } from '@ant-design/icons';

interface Props extends ModalProps {
    sportId: number;
    categoryId: number;
    trickId: number;
    variants: VariantPayload[]
    onSubmit: () => void;
}

const AddTrickVariantModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit, sportId, categoryId, trickId, variants}) => {
    const [form] = Form.useForm<TrickVariantEditPayload>();
    const { sessionStorage } = useSessionStorage();

    const handleFormSubmit = async (values: TrickVariantEditPayload) => {
        try {
            await createTrickVariant(sessionStorage ? sessionStorage : "", sportId, categoryId, trickId, values);
            onSubmit()
        } catch (err) {
            console.log(err);
            message.error("Failed to create trick variant!");
        }
    };

    const mapToSelectProps = (): SelectProps["options"] => {
        return variants.map((variant) => {
          return {
            value: variant.id,
            label: variant.name
          }});
      }

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            {!variants ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
                <div style={{ padding: '16px' }}>
                    <h2>
                        Add Trick Variant
                    </h2>

                    <Form form={form} onFinish={handleFormSubmit}>
                        <Form.Item name="shortDescription" rules={[{ required: true, message: 'Missing short description for trick!' }]}>
                            <TextArea placeholder='Short Description' rows={4} maxLength={100} />
                        </Form.Item>

                        <Form.Item name="description" rules={[{ required: true, message: 'Missing description for trick!' }]}>
                            <TextArea placeholder='Description' rows={8} maxLength={250} />
                        </Form.Item>

                        <Form.Item name="variantId">
                            <Select
                                placeholder="Please select variant"
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

export default AddTrickVariantModal;