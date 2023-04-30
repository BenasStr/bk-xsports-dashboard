import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Popconfirm, Row, Select, SelectProps, Space, Table, Tag, message } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { deleteUser, getUsers } from "../../../api/xsports/usersApi";
import { UserPayload, UsersPage } from "../../../api/apipayloads";
import { useSessionStorage } from "../../../hooks";
import SearchInput from "../../generics/Search";
import AddUserModal from "./AddUserModal";

const roles: string[] = [
  "ADMIN",
  "MODERATOR",
  "USER"
] 

const UserPage: React.FunctionComponent = () => {
  const [data, setData] = useState<UsersPage>();
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const { sessionStorage } = useSessionStorage();

  const getUsersData = async (search: string) => {
    try {
      const data: UsersPage = await getUsers(sessionStorage ? sessionStorage : "", search, selectedRole?selectedRole:"");
      setData(data);
    } catch (err) {
      message.error("Failed to reterieve users!")
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await deleteUser(sessionStorage?sessionStorage:"", id);
    } catch (err) {
      message.error("Failed to delete user!");
    }
    await getUsersData("");
  };

  const renderRole = useCallback((user: UserPayload) => {
    return (
      <Tag color={setTagColor(user.role)} key={user.id}>
        {user.role}
      </Tag>
    );
  }, []);

  const renderName = useCallback((user: UserPayload) => {
    const name = user.nickname == null || user.nickname == "" ?
      user.name + " " + user.surname :
      user.nickname
    return (
      <>
        {name}
      </>
    );
  }, [])

  const setTagColor = (role: string) => {
    if (role === "ADMIN") {
      return 'red';
    } else if (role === "MODERATOR") {
      return 'purple';
    }
    return 'green';
  };

  const mapToSelectProps = (): SelectProps["options"] => {
    return roles.map((role) => {
      return {
        value: role,
        label: role
      }});
  };

  const handleChange = (value: string) => {
    setSelectedRole(value);
  };

  const handleClear = () => {
    setSelectedRole(undefined);
  }

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAddModalVisible(false);
  }, []);

  const handleModalSubmit = useCallback(() => {
    handleCloseModal();
    getUsersData("");
  }, []);

  const handleSearch = (value: string) => {
    getUsersData(value);
  }

  useEffect(() => {
    getUsersData("")
  }, []);

  const renderActionColumn = (text: string, record: UserPayload) => {
    if (record.role === "ADMIN") {
      return <></>;
    }
    return (
      <div style={{ float: "right" }}>
        <Space>
          <Popconfirm
            placement="topRight"
            title={"Delete this user?"}
            onConfirm={() => handleDeleteClick(record.id)}
            okText="Yes"
            cancelText="Cancel"
          >
            <Button>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      </div>
    );
  };


  return (!data ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
    <>
      <div style={{ marginBottom: '10px' }}>
        <Row gutter={[8, 8]}>
          <Col span={8}>
            <SearchInput onSearch={handleSearch} />
          </Col>

          <Col span={8}>
            <Select 
              allowClear
              onClear={handleClear}
              value={selectedRole}
              onChange={handleChange}
              placeholder="Role Filter" 
              options={mapToSelectProps()}
              style={{ width: '140px' }}
            />
          </Col>

          <Col span={8}>
            <div style={{ float: 'right' }}>
              <Button onClick={() => handleOpenAddModal()}>+ Add Moderator</Button>
            </div>
          </Col>
        </Row>
      </div>
      <Table dataSource={data.items} pagination={{ pageSize: data.items_per_page, current: data.page_index, total: data.total_items }}>
        <Table.Column
          key="index"
          dataIndex="id"
          title="Index"
          width={25}
        />

        <Table.Column
          key="name"
          title="Name"
          render={renderName}
        />

        <Table.Column
          key="email"
          dataIndex="email"
          title="Email"
        />

        <Table.Column
          key="role"
          title="Role"
          render={renderRole}
        />

        <Table.Column
          key="actionColumn"
          render={renderActionColumn}
          fixed="right"
        />
      </Table>

      <AddUserModal
        open={isAddModalVisible}
        onCancel={handleCloseModal}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};

export default UserPage;
