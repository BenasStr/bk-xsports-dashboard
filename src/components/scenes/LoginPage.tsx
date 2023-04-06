import { Button, Form, Input } from "antd";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { login } from "../../api/xsports/authenticationApi";
import "./LoginPage.css";
import { useSessionStorage } from "../../hooks";
import { Token } from "../../api/apipayloads";

interface FormValues {
  email: string;
  password: string;
}

const LoginPage: React.FunctionComponent = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const history = useHistory();
  const { sessionStorage, setSessionStorage } = useSessionStorage();
  const authed = !!sessionStorage;

  const onFinish = useCallback(async (formData: FormValues) => {
    try {
      const data: Token = await login(formData);
      setSessionStorage(data.token);
    } catch (err) {
      Promise.reject("credentials");
    }
  }, []);

  if (authed) {
    history.push("/sports");
  }

  return (
    <div className="login-container">
      <img src="src/resources/XSports_HighRes_300ppi.png" alt="Logo" className="logo-container"/>
      <Form onFinish={onFinish}>
        <Form.Item name="email">
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "This is a required field" }]}
          validateTrigger={["onSubmit", "onChange"]}
        >
          <Input.Password
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
