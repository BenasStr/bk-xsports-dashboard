import React from 'react';
import { Form, Input, Button, Modal, ModalProps, message, FormInstance } from 'antd';
import { UserEditPayload } from '../../../api/apipayloads';
import { createUser } from '../../../api/xsports/usersApi';
import { useSessionStorage } from '../../../hooks';

interface Props extends ModalProps {
    onSubmit: () => void;
}

const AddUserModal: React.FunctionComponent<Props> = ({ open, onCancel, onSubmit }) => {
    const [form] = Form.useForm<UserEditPayload>();
    const { sessionStorage } = useSessionStorage();

    const handleFormSubmit = async (values: UserEditPayload) => {
        try {
            await createUser(sessionStorage?sessionStorage:"", values);
            onSubmit();
        } catch (err) {
            console.log(err);
            message.error("Failed to create moderator!");
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
                    Add Moderator
                </h2>

                <Form form={form} onFinish={handleFormSubmit}>
                    <Form.Item name="name" rules={[{ required: true, message: 'Missing name!' }]}>
                        <Input placeholder='Name' />
                    </Form.Item>

                    <Form.Item name="surname" rules={[{ required: true, message: 'Missing surname!' }]}>
                        <Input placeholder='Surname' />
                    </Form.Item>

                    <Form.Item name="nickname" >
                        <Input placeholder='Username' />
                    </Form.Item>

                    <Form.Item name="email" rules={[{ required: true, message: 'Missing email!' }]}>
                        <Input placeholder='Email' />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: 'Missing password!' }]}>
                        <Input.Password placeholder='Password' />
                    </Form.Item>


                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Password does not match!'));
                                },
                            }),
                        ]}
                    >
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