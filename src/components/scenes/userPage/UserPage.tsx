import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Popconfirm, Row, Select, Space, Table, Tag } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { getUsers } from "../../../api/xsports/usersApi";
import { UserPayload, UsersPage } from "../../../api/apipayloads";
import { useSessionStorage } from "../../../hooks";
import SearchInput from "../../generics/Search";
import AddUserModal from "./AddUserModal";

const UserPage: React.FunctionComponent = () => {
  const [data, setData] = useState<UsersPage>();
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const {sessionStorage} = useSessionStorage();

  const getCategoriesData = async () => {
    try {
      const data: UsersPage = await getUsers(sessionStorage?sessionStorage:"");
      setData(data);
    } catch (err) {
      console.log("Failed to reterieve categories")
    }
  }

  const renderRole = useCallback((user: UserPayload) => {
    return (
      <Tag color={user.role == "ADMIN"? 'red' : 'purple'} key={user.id}>
        {user.role}
      </Tag>
    );
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAddModalVisible(false);
  }, []);

  const handleModalSubmit = useCallback(() => {
    handleCloseModal();
    console.log("uga buga my guy");
  }, []);

  const handleSearch = (value: string) => {
    console.log(value);
  }

  useEffect(() => {
    getCategoriesData()
  }, []);

  return (!data ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
  <>
    <div style={{ marginBottom: '10px' }}>
        <Row gutter={[8, 8]}>
          <Col span={8}>
            <SearchInput onSearch={handleSearch}/>
          </Col>

          <Col span={8}>
            <Select/>
          </Col>

          <Col span={8}>
            <div style={{float: 'right'}}>
              <Button onClick={() => handleOpenAddModal()}>+ Add Moderator</Button>
            </div>
          </Col>
        </Row>
      </div>
    <Table dataSource={data.items} pagination={{ pageSize: data.items_per_page, current: data.page_index, total: data.total_items}}>
      <Table.Column key="index" dataIndex="id" title="Index" width={25}/>
      <Table.Column key="nickname" dataIndex="nickname" title="Name" />
      <Table.Column 
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

const renderActionColumn = () => {
  return (
    <div style={{float: "right"}}>
      <Space>
        <Button>Edit</Button>
        <Popconfirm
            placement="topRight"
            title={"Delete this variant?"}
            // onConfirm={() => handleDeleteClick(variant.id)}
            okText="Yes"
            cancelText="Cancel"
          >
            <Button>
              <DeleteOutlined/>
            </Button>
          </Popconfirm>
      </Space>
    </div>
  );
};

export default UserPage;
