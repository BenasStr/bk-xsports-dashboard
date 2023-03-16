import { DeleteOutlined, TagOutlined, TagsFilled } from "@ant-design/icons";
import { Button, Modal, Space, Table, Tag } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { deleteSport, getSports } from "../../../api/api";
import { SportPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";
import AddSportModal from "./AddSportModal";
import EditSportModal from "./EditSportModal";


const SportsPage: React.FunctionComponent = () => {
  const [data, setData] = useState<SportPayload[]>();
  const [doneLoading, setLoadingState] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [sportEdit, setSoprtEdit] = useState<SportPayload>({
    id: 0,
    name: '',
    photo_url: '',
    variants: []
  });
  const {sessionStorage} = useSessionStorage();
  const history = useHistory();

  const handleOpenAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  };

  const handleAddModalSubmit = () => {
    setIsAddModalVisible(false);
    getSportsData();
  } 

  const handleOpenEditModal = (sport: SportPayload) => {
    setSoprtEdit(sport);
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  };

  const handleEditModalSubmit = () => {
    setIsEditModalVisible(false);
    getSportsData();
  } 

  const getSportsData = async () => {
    try {
      setLoadingState(false);
      const data: SportPayload[] = await getSports(sessionStorage?sessionStorage:"");
      setData(data);
      console.log(data);
      setLoadingState(true);
    } catch (err) {
      console.log("Failed to reterieve sports")
    }
  }

  const handleDeleteClick = async (id: number) => {
      try {
        console.log("This will call delete");
        setLoadingState(false);
        await deleteSport(sessionStorage?sessionStorage : "", id);
        await getSportsData()
        setLoadingState(true)
      } catch(err) {
        console.log("Unable to delete");
      }
  }

  useEffect(() => {
    getSportsData()
  }, []);

  const renderActionColumn = useCallback((sport: SportPayload) => {
    return (
      <div style={{float: "right"}}>
        <Space>
          <Button onClick={() => handleOpenEditModal(sport)}>Edit</Button>
          <Button>
            <DeleteOutlined onClick={() => handleDeleteClick(sport.id)}/>
          </Button>
        </Space>
      </div>
    );
  }, []);

  const renderTags = useCallback((sport: SportPayload) => {
    // console.log("Rendering tags")
    // console.log(sport)
    return (
      <>
        {sport.variants.map((variant) => {
          return (
            <Tag color={"cyan"} key={variant.id}>
              {variant.name.toLocaleUpperCase()}
            </Tag>
          );
        })}
      </>
    );
  }, []);

  return ( !doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
    <div>
      <div style={{marginBottom: '10px'}}>
        <Button onClick={() => handleOpenAddModal()}>+ Add Sport</Button>
      </div>

      <Table dataSource={data} pagination={{ pageSize: 20 }}>
        <Table.Column key="index" dataIndex="id" title="Index" width={25}/>
        <Table.Column key="sport" dataIndex="name" title="Sport" />
        <Table.Column 
          key="tags" 
          title="Variants" 
          render={renderTags}
        />
        <Table.Column
          key="actionColumn"
          render={renderActionColumn}
          fixed="right"
        />
      </Table>

      <AddSportModal open={isAddModalVisible} onCancel={handleCloseAddModal} onSubmit={handleAddModalSubmit}/>
      <EditSportModal open={isEditModalVisible} onCancel={handleCloseEditModal} onSubmit={handleEditModalSubmit} sport={sportEdit}/>
    </div>
  );
};

export default SportsPage;
