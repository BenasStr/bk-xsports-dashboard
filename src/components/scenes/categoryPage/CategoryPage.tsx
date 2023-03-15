import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { getCategories } from "../../../api/api";
import { CategoryPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";

const CategoryPage: React.FunctionComponent = () => {
  const [data, setData] = useState<CategoryPayload[]>();
  const {sessionStorage} = useSessionStorage();
  const history = useHistory();

  const getCategoriesData = async () => {
    try {
      const data: CategoryPayload[] = await getCategories(sessionStorage?sessionStorage:"", 1);
      setData(data)
    } catch (err) {
      console.log("Failed to reterieve categories")
    }
  }

  const handleAddClick = () => {
    history.push(`/categories/add`);
  }

  const handleEditClick = (id: number) => {
    history.push(`/categories/${id}/edit`);
  }

  const handleDeleteClick = (id: number) => {
    console.log("THIS CATEGORY DELETE IS CLICKED")
    // history.push(`/sports/add`);
  }

  useEffect(() => {
    getCategoriesData()
  }, []);

  const renderActionColumn = useCallback((category: CategoryPayload) => {
    return (
      <div style={{float: "right"}}>
        <Space>
          <Button onClick={() => handleEditClick(category.id)}>Edit</Button>
          <Button>
            <DeleteOutlined onClick={() => handleDeleteClick(category.id)}/>
          </Button>
        </Space>
      </div>
    );
  }, []);

  return ( !data ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
    <div>
      <div style={{marginBottom: '10px'}}>
        <Button onClick={() => handleAddClick()}>Add Sport</Button>
      </div>
      <Table dataSource={data} pagination={{ pageSize: 20 }}>
        <Table.Column key="index" dataIndex="id" title="Index" width={25}/>
        <Table.Column key="category" dataIndex="name" title="Category" />
        <Table.Column
          key="actionColumn"
          render={renderActionColumn}
          fixed="right"
        />
      </Table>
    </div>
  );
};

export default CategoryPage;
