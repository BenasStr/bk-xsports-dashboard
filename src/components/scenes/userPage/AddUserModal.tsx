import React  from 'react';
import { Form, Input, Button, Modal, ModalProps } from 'antd';

interface Props extends ModalProps {
    onSubmit: () => void;
}

const AddUserModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit }) => {

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <div style={{ padding: '16px' }}>
                <h2>
                    Add Moderator
                </h2>

                <Form>
                    <Form.Item>
                        <Input placeholder='Name' />
                    </Form.Item>

                    <Form.Item>
                        <Input placeholder='Surname' />
                    </Form.Item>

                    <Form.Item>
                        <Input placeholder='Username' />
                    </Form.Item>

                    <Form.Item>
                        <Input placeholder='Email' />
                    </Form.Item>

                    <Form.Item>
                        <Input.Password placeholder='Password' />
                    </Form.Item>

                    <Form.Item>
                        <Input.Password placeholder='Repeat Password' />
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

export default AddUserModal;