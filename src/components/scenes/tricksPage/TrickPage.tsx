import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { deleteSport, getDifficulties, getTricks } from "../../../api/api";
import { DifficultyPayload, TrickBasicPayload, TrickEditPayload, TrickPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";
import AddTrickModal from "./AddTrickModal";

interface Trick {
  key: React.ReactNode;
  id: number;
  name: string;
  difficulty: string
  children?: Trick[];
}

const TricksPage: React.FunctionComponent = () => {
  const [data, setData] = useState<TrickPayload[]>([]);
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [doneLoading, setLoadingState] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const history = useHistory();
  const [sportId] = useState<number>(parseInt(history.location.pathname.split("/")[2]));
  const [categoryId] = useState<number>(parseInt(history.location.pathname.split("/")[4]));
  const [trickEdit, setTrickEdit] = useState<TrickEditPayload>({
    name: '',
    difficultyId: 0,
    trickParentsIds: [],
    description: '',
    shortDescription: ''
  });
  const [difficulties, setDifficulties] = useState<DifficultyPayload[]>([]);
  const {sessionStorage} = useSessionStorage();

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleAddModalSubmit = useCallback(() => {
    setIsAddModalVisible(false);
    getTricksData();
  }, []) 

  const handleCloseEditModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleEditModalSubmit = useCallback(() => {
    setIsEditModalVisible(false);
    getTricksData();
  }, []);
  
  const handleEditButtonClick = useCallback((trick: TrickPayload) => (event: MouseEvent)  => {
    event.stopPropagation();
    // setTrickEdit(trick);
    setIsEditModalVisible(true);
  }, [])

  const getTricksData = async () => {
    try {
      setLoadingState(false);
      const data: TrickPayload[] = await getTricks(sessionStorage?sessionStorage:"", sportId, categoryId);
      setData(data);
      console.log(data)
      setTricks(data.map((entry) => convertTrickPayload(entry)))
      setLoadingState(true);
    } catch (err) {
      console.log("Failed to reterieve tricks")
    }
  }

  function convertTrickPayload(payload: TrickPayload): Trick {
    const { id, name, difficulty, trickChildren } = payload;
    const children = trickChildren?.map(convertTrickBasicPayload);
    return { key: id, id: id, name, difficulty, children };
  }

  function convertTrickBasicPayload(payload: TrickBasicPayload): Trick {
    const { id, name, shortDescription } = payload;
    return { key: id, id: id, name, difficulty: shortDescription };
  }

  const getDifficultiesData = async () => {
    try {
      const data: DifficultyPayload[] = await getDifficulties(sessionStorage?sessionStorage:"");
      setDifficulties(data);
    } catch (err) {
      console.log("Failed to reterieve difficulties");
    }
  }

  const handleDeleteClick = async (id: number) => {
      try {
        setLoadingState(false);
        await deleteSport(sessionStorage?sessionStorage : "", id);
        await getTricksData()
        setLoadingState(true)
      } catch(err) {
        console.log("Unable to delete");
      }
  }

  useEffect(() => {
    getTricksData()
    getDifficultiesData()
  }, []);


  const renderActionColumn = useCallback((trick: TrickPayload) => {
    return (
      <div style={{float: "right"}}>
        <Space>
          <Button onClick={handleEditButtonClick(trick)}>Edit</Button>
          <Button>
            <DeleteOutlined onClick={() => handleDeleteClick(trick.id)}/>
          </Button>
        </Space>
      </div>
    );
  }, []);

  return ( 
    !doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
    <div>
      <div style={{marginBottom: '10px'}}>
        <Button onClick={() => handleOpenAddModal()}>+ Add Trick</Button>
      </div>

      <Table dataSource={tricks} pagination={{ pageSize: 20 }}>
        <Table.Column dataIndex="id" title="Index" width={25}/>
        <Table.Column dataIndex="name" title="Trick"/>
        <Table.Column dataIndex="difficulty" title="Difficulty"/>
        <Table.Column
          render={renderActionColumn}
          fixed="right"
        />
      </Table>

      <AddTrickModal 
        open={isAddModalVisible} 
        onCancel={handleCloseAddModal}
        onSubmit={handleAddModalSubmit} 
        sportId={sportId} 
        categoryId={categoryId} 
        tricks={data} 
        difficulties={difficulties}
      />
      {/* <EditSportModal open={isEditModalVisible} onCancel={handleCloseEditModal} onSubmit={handleEditModalSubmit} sport={sportEdit}/> */}
    </div>
  );
};

export default TricksPage;
