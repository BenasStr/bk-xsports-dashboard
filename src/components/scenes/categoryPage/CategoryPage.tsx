import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { deleteCategory, getCategories } from "../../../api/api";
import { CategoryPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const CategoryPage: React.FunctionComponent = () => {
  const [data, setData] = useState<CategoryPayload[]>();
  const [doneLoading, setLoadingState] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const history = useHistory();
  const [sportId] = useState<number>(parseInt(history.location.pathname.split("/")[2]));
  const {sessionStorage} = useSessionStorage();
  const [categoryEdit, setCategoryEdit] = useState<CategoryPayload>({
    id: 0,
    name: '',
    photo_url: ''
  });

  const getCategoriesData = async () => {
    try {
      setLoadingState(false);
      const data: CategoryPayload[] = await getCategories(sessionStorage?sessionStorage:"", sportId);
      setData(data)
      setLoadingState(true);
    } catch (err) {
      console.log("Failed to reterieve categories")
    }
  }

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleAddModalSubmit = useCallback(() => {
    setIsAddModalVisible(false);
    getCategoriesData();
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleEditModalSubmit = useCallback(() => {
    setIsEditModalVisible(false);
    getCategoriesData();
  }, []);

  const handleEditButtonClick = useCallback((category: CategoryPayload) => (event: MouseEvent)  => {
    event.stopPropagation();
    setCategoryEdit(category);
    setIsEditModalVisible(true);
  }, [])

  const handleDeleteClick = async (id: number) => {
    try {
      setLoadingState(false);
      await deleteCategory(sessionStorage?sessionStorage : "", sportId, id);
      await getCategoriesData()
      setLoadingState(true)
    } catch(err) {
      console.log("Unable to delete");
    }
  }

  const onRowClick = (category: CategoryPayload, event: MouseEvent) => {
    history.push(`/sports/${sportId}/categories/${category.id}/tricks`);
  };

  const rowProps = (category: CategoryPayload) => {
    return {
      onClick: (event: MouseEvent) => {
        onRowClick(category, event);
      },
    };
  };


  useEffect(() => {
    getCategoriesData()
  }, []);

  const renderActionColumn = useCallback((category: CategoryPayload) => {
    return (
      <div style={{float: "right"}}>
        <Space>
          <Button onClick={handleEditButtonClick(category)}>Edit</Button>
          <Button>
            <DeleteOutlined onClick={() => handleDeleteClick(category.id)}/>
          </Button>
        </Space>
      </div>
    );
  }, []);

  return ( !doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
    <div>
      <div style={{marginBottom: '10px'}}>
        <Button onClick={() => handleOpenAddModal()}>+ Add Category</Button>
      </div>
      <Table dataSource={data} pagination={{ pageSize: 20 }} onRow={rowProps}>
        <Table.Column key="index" dataIndex="id" title="Index" width={25}/>
        <Table.Column key="category" dataIndex="name" title="Category" />
        <Table.Column
          key="actionColumn"
          render={renderActionColumn}
          fixed="right"
        />
      </Table>
 
      <AddCategoryModal open={isAddModalVisible} onCancel={handleCloseAddModal} onSubmit={handleAddModalSubmit} sportId={sportId}/>
      <EditCategoryModal open={isEditModalVisible} onCancel={handleCloseEditModal} onSubmit={handleEditModalSubmit} category={categoryEdit} sportId={sportId}/>
    </div>
  );
};

export default CategoryPage;
