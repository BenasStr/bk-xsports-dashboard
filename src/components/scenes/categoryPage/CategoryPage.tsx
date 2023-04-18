import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, message, Popconfirm, Row, Select, SelectProps, Space, Table, Tag } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { deleteCategory, getCategories } from "../../../api/xsports/categoriesApi";
import { CategoryPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import SearchInput from "../../generics/Search";
import { getColorBasedOnPublishStatus, getStatuses } from "../../../utils/utils";

const CategoryPage: React.FunctionComponent = () => {
  const history = useHistory();
  const [sportId] = useState<number>(parseInt(history.location.pathname.split("/")[2]));
  const [data, setData] = useState<CategoryPayload[]>();
  const [doneLoading, setLoadingState] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const { sessionStorage } = useSessionStorage();
  const [categoryEdit, setCategoryEdit] = useState<CategoryPayload>({
    id: 0,
    name: '',
    photo: '',
    publishStatus: '',
    tricksCount: 0,
    lastUpdated: ''
  });

  const getCategoriesData = async (search: string) => {
    setLoadingState(false);
    try {
      const data: CategoryPayload[] = await getCategories(sessionStorage ? sessionStorage : "", sportId, search, selectedStatus?selectedStatus:"");
      setData(data)
    } catch (err) {
      message.error("Failed to reterieve categories!");
    }
    setLoadingState(true);
  };

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleAddModalSubmit = useCallback(() => {
    setIsAddModalVisible(false);
    getCategoriesData("");
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleEditModalSubmit = useCallback(() => {
    setIsEditModalVisible(false);
    getCategoriesData("");
  }, []);

  const handleEditButtonClick = useCallback((category: CategoryPayload) => (event: MouseEvent) => {
    event.stopPropagation();
    setCategoryEdit(category);
    setIsEditModalVisible(true);
  }, []);

  const handleSearch = (value: string) => {
    getCategoriesData(value)
  };

  const handleDeleteClick = useCallback((id: number) => async (event: MouseEvent) => {
    event.stopPropagation();
    setLoadingState(false);
    try {
      await deleteCategory(sessionStorage ? sessionStorage : "", sportId, id);
      await getCategoriesData("");
      message.success("Deleted category!");
    } catch (err) {
      message.error("Delete failed!");
    }
    setLoadingState(true)
  }, []);

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

  const mapToSelectProps = (): SelectProps["options"] => {
    return getStatuses().map((status) => {
      return {
        value: status,
        label: status
      }});
  };

  const handleChange = (value: string) => {
    if (value === "ALL") {
      setSelectedStatus(undefined);
    } else {
      setSelectedStatus(value);
    }
  };

  const renderStatus = useCallback((sport: CategoryPayload) => {
    const color = getColorBasedOnPublishStatus(sport.publishStatus);
    return (
      <>
        <Tag color={color} key={sport.id}>
          {sport.publishStatus.toLocaleUpperCase()}
        </Tag>
      </>
    )
  }, []);


  useEffect(() => {
    getCategoriesData("")
  }, []);

  const renderActionColumn = useCallback((category: CategoryPayload) => {
    return (
      <div style={{ float: "right" }}>
        <Space>
          <Button onClick={handleEditButtonClick(category)}>
            Edit
          </Button>

          <Popconfirm
            onClick={(e: MouseEvent) => e.stopPropagation()}
            placement="topRight"
            title={"Delete this variant?"}
            onConfirm={handleDeleteClick(category.id)}
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
  }, []);

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <Row gutter={[8, 8]}>
          <Col span={8}>
            <SearchInput onSearch={handleSearch}/>
          </Col>

          <Col span={8}>
            <Select
              value={selectedStatus}
              onChange={handleChange}
              placeholder="Status Filter" 
              options={mapToSelectProps()}
              style={{ width: '160px' }}/>
          </Col>

          <Col span={8}>
            <div style={{float: 'right'}}>
              <Button onClick={() => handleOpenAddModal()}>+ Add Category</Button>
            </div>
          </Col>
        </Row>
      </div>

      {
        !doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
        <>
          <Table dataSource={data} pagination={{ pageSize: 20 }} onRow={rowProps}>
            <Table.Column key="index" dataIndex="id" title="Index" width={25} />

            <Table.Column key="category" dataIndex="name" title="Category" />

            <Table.Column title="Status" render={renderStatus}/>

            <Table.Column dataIndex="lastUpdated" title="Last Updated"/>

            <Table.Column dataIndex="tricksCount" title="Tricks Count"/>

            <Table.Column
              key="actionColumn"
              render={renderActionColumn}
              fixed="right"
            />
          </Table>
    
          <AddCategoryModal 
            open={isAddModalVisible} 
            onCancel={handleCloseAddModal} 
            onSubmit={handleAddModalSubmit} 
            sportId={sportId} 
          />
    
          <EditCategoryModal 
            open={isEditModalVisible} 
            onCancel={handleCloseEditModal} 
            onSubmit={handleEditModalSubmit} 
            category={categoryEdit} 
            sportId={sportId} 
          />
        </>
      }
    </>
  );
};

export default CategoryPage;
