import { Button, Col, Popconfirm, Row, SelectProps, Space, Table, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { PublishAvailableCategoriesPayload, PublishPayload } from "../../../api/apipayloads";
import { deletePublish, getPublishCategories, getPublishes } from "../../../api/xsports/publichApi";
import { useSessionStorage } from "../../../hooks";
import AddPublishModal from "./AddPublishModal";
import PublishModal from "./PublishModal";

const PublishPage: React.FunctionComponent = () => {
  const [publish, setPublish] = useState<PublishPayload[]>();
  const [categories, setCategories] = useState<PublishAvailableCategoriesPayload[]>([]);
  const [doneLoading, setLoadingState] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isPublishModalVisible, setIsPublishModalVisible] = useState<boolean>(false);
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

  const handleCloseModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setIsPublishModalVisible(false);
  }, []);

  const handleAddModalSubmit = useCallback(() => {
    setIsAddModalVisible(false);
    getPublishData()
  }, []);

  const handleOpenPublishModal = useCallback(() => {
    setIsPublishModalVisible(true);
  }, []);

  const handlePublishModalSubmit = useCallback(() => {
    setIsPublishModalVisible(false);
  }, []);

  const handleOpenEditModal = useCallback(() => {
    setIsEditModalVisible(true);
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
      <div style={{float: 'right', marginBottom: '10px' }}>
        <Button onClick={() => handleOpenPublishModal()} style={{marginRight: '5px'}}> Publish </Button>
        <Button onClick={() => handleOpenAddModal()}>+ Schedule Publish</Button>
      </div>

      {
        !doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
        <>
          <Table dataSource={publish} pagination={{ pageSize: 20 }}>
            <Table.Column dataIndex="id" title="Index" width={25} />

            <Table.Column dataIndex="name" title="Updates" />

            <Table.Column dataIndex="releaseDate" title="Scheduled release"/>

            <Table.Column render={renderActionColumn} fixed="right"/>
          </Table>


          <PublishModal
            open={isPublishModalVisible}
            onCancel={handleCloseModal}
            onSubmit={handlePublishModalSubmit}
            categories={categories}
          />
          <AddPublishModal 
            open={isAddModalVisible}
            onCancel={handleCloseModal}
            onSubmit={handleAddModalSubmit}
            categories={categories}
          />
        </>
      }
    </div>
  );
};

export default PublishPage;
