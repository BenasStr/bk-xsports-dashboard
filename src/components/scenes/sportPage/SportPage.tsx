import { DeleteOutlined, TagOutlined, TagsFilled } from "@ant-design/icons";
import { Button, Modal, Row, Space, Table, Tag } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { deleteSport, getSports } from "../../../api/api";
import { SportEditPayload, SportPayload } from "../../../api/apipayloads";
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

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleAddModalSubmit = useCallback(() => {
    setIsAddModalVisible(false);
    getSportsData();
  }, []) 

  const handleCloseEditModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleEditModalSubmit = useCallback(() => {
    setIsEditModalVisible(false);
    getSportsData();
  }, []);
  
  const handleEditButtonClick = useCallback((sport: SportPayload) => (event: MouseEvent)  => {
    event.stopPropagation();
    setSoprtEdit(sport);
    setIsEditModalVisible(true);
  }, [])

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

  const onRowClick = (sport: SportPayload, event: MouseEvent) => {
    history.push(`/sports/${sport.id}/categories`);
  };

  const handleDeleteClick = async (id: number) => {
      try {
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

  // onClick={() => {handleOpenEditModal(sport)}}


  const renderActionColumn = useCallback((sport: SportPayload) => {
    return (
      <div style={{float: "right"}}>
        <Space>
          <Button onClick={handleEditButtonClick(sport)}>Edit</Button>
          <Button>
            <DeleteOutlined onClick={() => handleDeleteClick(sport.id)}/>
          </Button>
        </Space>
      </div>
    );
  }, []);

  const renderTags = useCallback((sport: SportPayload) => {
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

  const rowProps = (sport: SportPayload) => {
    return {
      onClick: (event: MouseEvent) => {
        onRowClick(sport, event);
      },
    };
  };

  return ( !doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
    <div>
      <div style={{marginBottom: '10px'}}>
        <Button onClick={() => handleOpenAddModal()}>+ Add Sport</Button>
      </div>

      <Table dataSource={data} pagination={{ pageSize: 20 }} onRow={rowProps}>
        <Table.Column dataIndex="id" title="Index" width={25}/>
        <Table.Column dataIndex="name" title="Sport"/>
        <Table.Column 
          title="Variants" 
          render={renderTags}
        />
        <Table.Column
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
