import { Button, Col, Popconfirm, Row, SelectProps, Space, Table, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { PublishAvailableCategoriesPayload, PublishPayload } from "../../../api/apipayloads";
import { deletePublish, getPublishCategories, getPublishes } from "../../../api/xsports/publichApi";
import { useSessionStorage } from "../../../hooks";
import AddPublishModal from "./AddPublishModal";

const PublishPage: React.FunctionComponent = () => {
  const [publish, setPublish] = useState<PublishPayload[]>();
  const [categories, setCategories] = useState<PublishAvailableCategoriesPayload[]>([]);
  const [doneLoading, setLoadingState] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [publishEdit, setPublishEdit] = useState<PublishPayload>({
    id: 0,
    name: '',
    releaseDate: '',
    sport: {
      id: 0,
      name: '',
      category: {
        id: 0,
        name: ''
      }
    }
  })
  const { sessionStorage } = useSessionStorage();


  const handleOpenAddModal = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleAddModalSubmit = useCallback(() => {
    setIsAddModalVisible(false);
    getPublishData()
  }, [])

  const handleCloseEditModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleEditModalSubmit = useCallback(() => {
    setIsEditModalVisible(false);
    getPublishData()
  }, []);

  const getPublishData = async () => {
    try {
      const data: PublishPayload[] = await getPublishes(sessionStorage?sessionStorage:"");
      setPublish(data);
    } catch (err) {
      message.error("Failed to reterieve publish!")
    }
  }

  const getPublishAvailableCategories = async () => {
    try {
      const data: PublishAvailableCategoriesPayload[] = await getPublishCategories(sessionStorage?sessionStorage:"")
      console.log(data);
      setCategories(data);
    } catch (err) {
      message.error("Failed to retrieve categories!");
    }
  }

  const handleEditButtonClick = useCallback((sport: PublishPayload) => (event: MouseEvent) => {
    event.stopPropagation();
    setPublishEdit(sport);
    setIsEditModalVisible(true);
  }, []);

  const handleDeleteClick = useCallback((id: number) => async (event: MouseEvent) => {
    event.stopPropagation();
    setLoadingState(false);
    try {
      await deletePublish(sessionStorage ? sessionStorage : "", id);
      message.success("Deleted publish!")
    } catch (err) {
      message.error("Unable to delete publish!")
    }
    await getPublishData()
    setLoadingState(true)
  }, []);

  useEffect(() => {
    setLoadingState(false);
    getPublishData();
    getPublishAvailableCategories()
    setLoadingState(true)
  }, []);

  const renderActionColumn = useCallback((publish: PublishPayload) => {
    return (
      <div style={{ float: "right" }}>
        <Space>
          <Button onClick={handleEditButtonClick(publish)}>
            Edit
          </Button>
  
          <Popconfirm
            onClick={(e: MouseEvent) => e.stopPropagation()}
            placement="topRight"
            title={"Delete this sport?"}
            onConfirm={handleDeleteClick(publish.id)}
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
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <div style={{float: 'right', marginBottom: '10px'}}>
          <Button onClick={() => handleOpenAddModal()}>+ Add Publish</Button>
        </div>
      </div>

      {
        !doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
        <>
          <Table dataSource={publish} pagination={{ pageSize: 20 }}>
            <Table.Column dataIndex="id" title="Index" width={25} />

            <Table.Column dataIndex="name" title="Name" />

            <Table.Column dataIndex="releaseDate" title="Scheduled release"/>

            <Table.Column render={renderActionColumn} fixed="right"/>
          </Table>

          <AddPublishModal 
            open={isAddModalVisible}
            onCancel={handleCloseAddModal}
            onSubmit={handleAddModalSubmit}
            categories={categories}
          />
        </>
      }
    </div>
  );
};

export default PublishPage;
