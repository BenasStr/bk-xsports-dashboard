import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Table } from "antd";
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
  const [difficulties, setDifficulties] = useState<DifficultyPayload[]>([]);
  const [doneLoading, setLoadingState] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const history = useHistory();
  const [sportId] = useState<number>(parseInt(history.location.pathname.split("/")[2]));
  const [categoryId] = useState<number>(parseInt(history.location.pathname.split("/")[4]));
  // const [trickEdit, setTrickEdit] = useState<TrickPayload>({
  //   name: '',
  //   trickParentsIds: [],
  //   description: '',
  //   shortDescription: ''
  // });
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

  const handleEditButtonClick = useCallback((trick: TrickPayload) => (event: MouseEvent) => {
    event.stopPropagation();
    // setTrickEdit(trick);
    setIsEditModalVisible(true);
  }, [])

  const getTricksData = async () => {
    try {
      setLoadingState(false);
      const data: TrickPayload[] = await getTricks(sessionStorage ? sessionStorage : "", sportId, categoryId);
      setData(data);
      console.log(data)
      setTricks(data.map((entry) => convertTrickPayload(entry)))
      setLoadingState(true);
    } catch (err) {
      console.log(err);
      message.error("Failed to reterieve tricks!");
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
      const data: DifficultyPayload[] = await getDifficulties(sessionStorage ? sessionStorage : "");
      setDifficulties(data);
    } catch (err) {
      console.log("Failed to reterieve difficulties");
    }
  }

  const handleAddVariantClick = useCallback(() => async(event: MouseEvent) => {
    event.stopPropagation();
    message.info("Well this is clicked...")
  }, [])

  const handleDeleteClick = useCallback((id: number) => async (event: MouseEvent) => {
    event.stopPropagation();
    setLoadingState(false);
    try {
      await deleteSport(sessionStorage ? sessionStorage : "", id);
      message.success("Deleted trick!");
    } catch (err) {
      console.log(err);
      message.error("Failed to delete trick!");
    }
    await getTricksData();
    setLoadingState(true)
  }, [])

  useEffect(() => {
    getTricksData()
    getDifficultiesData()
  }, []);


  const renderActionColumn = useCallback((trick: TrickPayload) => {
    return (
      <div style={{ float: "right" }}>
        <Space>
          <Button onClick={handleAddVariantClick()}>
            + Add Variant
          </Button>

          <Button onClick={handleEditButtonClick(trick)}>
            Edit
          </Button>

          <Popconfirm
            onClick={(e: MouseEvent) => e.stopPropagation()}
            placement="topRight"
            title={"Delete this variant?"}
            onConfirm={handleDeleteClick(trick.id)}
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
    !doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
      <div>
        <div style={{ marginBottom: '10px' }}>
          <Button onClick={() => handleOpenAddModal()}>+ Add Trick</Button>
        </div>

        <Table dataSource={tricks} pagination={{ pageSize: 20 }}>
          <Table.Column dataIndex="id" title="Index" width={25} />
          <Table.Column dataIndex="name" title="Trick" />
          <Table.Column dataIndex="difficulty" title="Difficulty" />
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
