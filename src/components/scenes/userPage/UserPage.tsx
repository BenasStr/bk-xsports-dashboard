import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getUsers } from "../../../api/api";
import { UsersPage, UserPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";

const UserPage: React.FunctionComponent = () => {
  const [data, setData] = useState<UsersPage>();

  const {sessionStorage} = useSessionStorage();

  const getCategoriesData = async () => {
    try {
      const data: UsersPage = await getUsers(sessionStorage?sessionStorage:"");
      setData(data);
    } catch (err) {
      console.log("Failed to reterieve categories")
    }
  }

  useEffect(() => {
    getCategoriesData()
  }, []);

  return (!data ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
    <Table dataSource={data?.items} pagination={{ pageSize: data?.items_per_page, current: data?.page_index, total: data?.total_items}}>
      <Table.Column key="index" dataIndex="id" title="Index" width={25}/>
      <Table.Column key="name" dataIndex="name" title="Name" />
      <Table.Column
        key="actionColumn"
        render={renderActionColumn}
        fixed="right"
      />
    </Table>
  );
};

const renderActionColumn = () => {
  return (
    <div style={{float: "right"}}>
      <Space>
        <Button>Edit</Button>
        <Button>
          <DeleteOutlined />
        </Button>
      </Space>
    </div>
  );
};

export default UserPage;