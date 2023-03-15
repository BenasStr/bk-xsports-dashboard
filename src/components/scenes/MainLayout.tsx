import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Dropdown, Layout, Menu, MenuProps, Space } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../hooks";
import { typeSafeSwitch } from "../../utils/generics";
import "./MainLayout.css";

const MainLayout: React.FunctionComponent<React.PropsWithChildren<{currentKey: string}>> = ({
  currentKey,
  children,
}) => {
  const [keyState, setKeyState] = useState<string>(currentKey); 
  const { setSessionStorage } = useSessionStorage();
  const history = useHistory();

  const handleMenuItemClick = useCallback(({ key }: { key: string }) => {

    console.log("Clicked", key);

    if (key === "SAMPLE") {
      setKeyState("SAMPLE")
      history.push("/sample");
    }

    if (key === "SPORTS") {
      setKeyState("SPORTS")
      history.push("/sports")
    }

    if (key === "CATEGORIES") {
      setKeyState("CATEGORIES")
      history.push("/categories")
    }

    if (key === "USERS") {
      setKeyState("USERS")
      history.push("/users")
    }
  }, []);

  const handleUserMenuItemClick = useCallback(({ key }: { key: string }) => {
    if (key === "ACCOUNT") {
      setKeyState("ACCOUNT")
      history.push("/account")
    }

    if (key === "LOGOUT") {
      setSessionStorage("");
      history.push("/login");
    }
  }, []);

  const menuItems = useMemo<MenuProps["items"]>(
    () =>
      menuItemKeys.map((key) => ({
        key,
        label: getNameByMenuKey(key),
        onClick: handleMenuItemClick,
      })),
    []
  );

  const userMenuItems = useMemo<MenuProps["items"]>(
    () =>
      userMenuItemKeys.map((key) => ({
        key,
        label: getNameByMenuKey(key),
        onClick: handleUserMenuItemClick,
      })),
    []
  );

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ backgroundColor: "#19181a", color: "whitesmoke" }}>
        <div>
          <img src="src/resources/XSports_ScreenRes_72ppi.png" alt="Logo" className="logo"/>
          <div style={{ float: "right", marginRight: 30 }} onClick={() => {}}>
            <span>
              <Space>
                <UserOutlined />
                This user display name
                <Dropdown
                  menu={{ items: userMenuItems }}
                  trigger={["click"]}
                  placement="bottom"
                >
                  <DownOutlined
                    style={{ fontSize: "12px", cursor: "pointer" }}
                  />
                </Dropdown>
              </Space>
            </span>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider style={{ backgroundColor: "#ffffff" }}>
          <Menu items={menuItems} activeKey={keyState}></Menu>
        </Sider>
        <Layout style={{ marginLeft: 8, marginTop: 8 }}>
          <Breadcrumb>
            <Breadcrumb.Item>Ugen</Breadcrumb.Item>
            <Breadcrumb.Item>Bugen</Breadcrumb.Item>
          </Breadcrumb>
          <Content style={{ marginTop: 16, marginRight: 16, marginBottom: 16 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

type MenuItems =
  | "SPORTS"
  | "CATEGORIES"
  | "USERS"
  | "SAMPLE";

type UserMenuItems = 
  | "ACCOUNT"
  | "LOGOUT";

const menuItemKeys: MenuItems[] = [
  "SPORTS",
  "SAMPLE",
  "CATEGORIES",
  "USERS"
];

const userMenuItemKeys: UserMenuItems[] = ["ACCOUNT", "LOGOUT"];

const getNameByMenuKey = typeSafeSwitch<MenuItems | UserMenuItems, string>({
  SPORTS: "Sports",
  SAMPLE: "Sample",
  CATEGORIES: "Categories",
  USERS: "Users",
  ACCOUNT: "Account",
  LOGOUT: "Log out",
});

export default MainLayout;
