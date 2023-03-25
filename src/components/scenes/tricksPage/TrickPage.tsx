import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Table } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { deleteSport, getDifficulties, getTricks, getSport } from "../../../api/api";
import { DifficultyPayload, TrickBasicPayload, TrickEditPayload, TrickPayload, SportPayload, VariantPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";
import AddTrickModal from "./AddTrickModal";
import AddTrickVariantModal from "./AddTrickVariantModal";

const TricksPage: React.FunctionComponent = () => {
  const [data, setData] = useState<TrickPayload[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyPayload[]>([]);
  const [doneLoading, setLoadingState] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isAddVariantModalVisible, setIsAddVariantModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [variants, setVariants] = useState<VariantPayload[]>([]);
  const [selectedTrickId, setSelectedTrickId] = useState<number>(-1);
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

  const handleCloseModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setIsAddVariantModalVisible(false);
  }, []);

  const handleModalSubmit = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setIsAddVariantModalVisible(false);
    getTricksData();
  }, []);

  const handleEditButtonClick = useCallback((trick: TrickPayload | TrickBasicPayload) => (event: any) => {
    event.stopPropagation();
    // setTrickEdit(trick);
    setIsEditModalVisible(true);
  }, [])

  const getTricksData = async () => {
    try {
      setLoadingState(false);
      const data: TrickPayload[] = await getTricks(sessionStorage ? sessionStorage : "", sportId, categoryId);
      setData(data);
      setLoadingState(true);
    } catch (err) {
      console.log(err);
      message.error("Failed to reterieve tricks!");
    }
  }

  const getDifficultiesData = async () => {
    try {
      const data: DifficultyPayload[] = await getDifficulties(sessionStorage ? sessionStorage : "");
      setDifficulties(data);
    } catch (err) {
      console.log(err);
      message.error("Failed to reterieve difficulties!");
    }
  }

  const getSportVariants = async () => {
    try {
      const data: SportPayload = await getSport(sessionStorage ? sessionStorage : "", sportId);
      setVariants(data.variants);
    } catch (err) {
      console.log(err);
      message.error("Failed to retrieve sport variants");
    }
  }

  const handleAddVariantClick = useCallback((trick: TrickPayload) => async(event: any) => {
    event.stopPropagation();
    setSelectedTrickId(trick.id);
    setIsAddVariantModalVisible(true);
  }, []);

  const handleDeleteClick = useCallback((id: number) => async (event: any) => {
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
    getSportVariants()
  }, []);

  const renderVariantTricks = useCallback((tricks: TrickBasicPayload[]) => {
    return(
      <Table dataSource={tricks} pagination={false} showHeader={false}>
        <Table.Column dataIndex="id" width={70}/>
        <Table.Column dataIndex="name"/>
        <Table.Column
            render={renderVariantActionColumn}
            fixed="right"
          />
      </Table>
    );
  }, []);

  const renderVariantActionColumn = useCallback((trick: TrickBasicPayload) => {
    return (
      <div style={{ float: "right" }}>
        <Space>
          <Button onClick={handleEditButtonClick(trick)}>
            Edit
          </Button>

          <Popconfirm
          //@ts-ignore
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

  const renderActionColumn = useCallback((trick: TrickPayload) => {
    return (
      <div style={{ float: "right" }}>
        <Space>
          <Button onClick={handleAddVariantClick(trick)}>
            + Add Variant
          </Button>

          <Button onClick={handleEditButtonClick(trick)}>
            Edit
          </Button>

          <Popconfirm
          //@ts-ignore
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

        <Table 
          dataSource={data} pagination={{ pageSize: 20 }}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender: (record) => renderVariantTricks(record.trickVariants),
            rowExpandable: (record) => record.trickVariants.length > 0,
          }}  
        >
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
          onCancel={handleCloseModal}
          onSubmit={handleModalSubmit}
          sportId={sportId}
          categoryId={categoryId}
          tricks={data}
          difficulties={difficulties}
        />

        <AddTrickVariantModal
          open={isAddVariantModalVisible}
          onCancel={handleModalSubmit} 
          onSubmit={handleModalSubmit}
          sportId={sportId}
          categoryId={categoryId}
          trickId={selectedTrickId}
          variants={variants}     
        />
        {/* <EditSportModal open={isEditModalVisible} onCancel={handleCloseEditModal} onSubmit={handleEditModalSubmit} sport={sportEdit}/> */}
      </div>
  );
};

export default TricksPage;
