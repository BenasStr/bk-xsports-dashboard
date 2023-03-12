import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getCategories } from "../../../api/api";
import { GetCategoryPayload, GetSportPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";

const CategoryPage: React.FunctionComponent = () => {
  const [data, setData] = useState<GetCategoryPayload[]>();
  const {sessionStorage} = useSessionStorage();

  const getCategoriesData = async () => {
    try {
      const data: GetCategoryPayload[] = await getCategories(sessionStorage?sessionStorage:"");
      setData(data)
    } catch (err) {
      console.log("Failed to reterieve categories")
    }
  }

  useEffect(() => {
    getCategoriesData()
  }, []);

  return (
    <Table dataSource={data} pagination={{ pageSize: 20 }}>
      <Table.Column key="index" dataIndex="id" title="Index" width={25}/>
      <Table.Column key="category" dataIndex="name" title="Category" />
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

export default CategoryPage;
