import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, message, Popconfirm, Row, Select, Space, Table } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { deleteSport, getDifficulties, getTricks, getSport, deleteTrick, deleteTrickVariant, getTrick } from "../../../api/api";
import { DifficultyPayload, TrickBasicPayload, TrickEditPayload, TrickPayload, SportPayload, VariantPayload, TrickVariantEditPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";
import AddTrickModal from "./AddTrickModal";
import AddTrickVariantModal from "./AddTrickVariantModal";
import EditTrickModal from "./EditTrickModal";
import EditTrickVariantModal from "./EditTrickVariantModal";
import SearchInput from "../../generics/Search";

const TricksPage: React.FunctionComponent = () => {
  const [data, setData] = useState<TrickPayload[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyPayload[]>([]);

  const [doneLoading, setLoadingState] = useState<boolean>(false);

  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isAddVariantModalVisible, setIsAddVariantModalVisible] = useState<boolean>(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isEditVariantModalVisible, setIsEditVariantModalVisible] = useState<boolean>(false);

  const [variants, setVariants] = useState<VariantPayload[]>([]);
  const [selectedTrickId, setSelectedTrickId] = useState<number>(-1);
  const history = useHistory();
  const [sportId] = useState<number>(parseInt(history.location.pathname.split("/")[2]));
  const [categoryId] = useState<number>(parseInt(history.location.pathname.split("/")[4]));
  const { sessionStorage } = useSessionStorage();
  const [trickEdit, setTrickEdit] = useState<TrickPayload>({
    id: 0,
    name: '',
    shortDescription: '',
    description: '',
    difficulty: '',
    video: '',
    trickParents: [],
    trickChildren: [],
    trickVariants: []
  });

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setIsAddVariantModalVisible(false);
    setIsEditVariantModalVisible(false);
  }, []);

  const handleModalSubmit = useCallback(() => {
    handleCloseModal();
    getTricksData();
  }, []);

  const handleEditButtonClick = useCallback((trick: TrickPayload) => (event: any) => {
    event.stopPropagation();
    setTrickEdit(trick);
    setIsEditModalVisible(true);
  }, []);

  const handleEditVariantButtonClick = useCallback((trick: TrickBasicPayload) => (event: any) => {
    event.stopPropagation();
    getTrickData(trick.id);
    setIsEditVariantModalVisible(true);
  }, []);

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

  const getTrickData = async (id: number) => {
    try {
      const data: TrickPayload = await getTrick(sessionStorage ? sessionStorage : "", sportId, categoryId, id);
      setTrickEdit(data);
    } catch (err) {
      console.log(err);
      message.error("Failed to retrieve trick!");
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

  const handleTrickDeleteClick = useCallback((id: number) => async (event: any) => {
    event.stopPropagation();
    setLoadingState(false);
    try {
      await deleteTrick(sessionStorage ? sessionStorage : "", sportId, categoryId, id);
      message.success("Deleted trick and variants!");
    } catch (err) {
      console.log(err);
      message.error("Failed to delete trick!");
    }
    await getTricksData();
    setLoadingState(true)
  }, []);

  const handleVariantDeleteClick = useCallback((trickId: number, variantId: number) => async (event: any) => {
    event.stopPropagation();
    setLoadingState(false);
    console.log(trickId)
    console.log(variantId)
    try {
      await deleteTrickVariant(sessionStorage ? sessionStorage : "", sportId, categoryId, trickId, variantId);
      message.success("Deleted variant!");
    } catch (err) {
      console.log(err);
      message.error("Failed to delete trick!");
    }
    await getTricksData();
    setLoadingState(true)
  }, []);

  const handleSearch = (value: string) => {
    console.log(value);
  };

  useEffect(() => {
    getTricksData()
    getDifficultiesData()
    getSportVariants()
  }, []);

  const renderVariantTricks = useCallback((tricks: TrickBasicPayload[], trickId: number) => {
    return(
      <Table dataSource={tricks} pagination={false} showHeader={false}>
        <Table.Column dataIndex="id" width={70}/>
        <Table.Column dataIndex="name"/>
        <Table.Column
            render={renderVariantActionColumn(trickId)}
            fixed="right"
          />
      </Table>
    );
  }, []);

  const renderVariantActionColumn = useCallback((trickId: number) => (trickVariant: TrickBasicPayload) => {
    return (
      <div style={{ float: "right" }}>
        <Space>
          <Button onClick={handleEditVariantButtonClick(trickVariant)}>
            Edit
          </Button>

          <Popconfirm
          //@ts-ignore
            onClick={(e: MouseEvent) => e.stopPropagation()}
            placement="topRight"
            title={"Delete this trick variant?"}
            onConfirm={handleVariantDeleteClick(trickId, trickVariant.id)}
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
            title={"Delete this trick and variants?"}
            onConfirm={handleTrickDeleteClick(trick.id)}
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
              <Select/>
            </Col>

            <Col span={8}>
              <div style={{float: 'right'}}>
                <Button onClick={() => handleOpenAddModal()}>+ Add Trick</Button>
              </div>
            </Col>
          </Row>
        </div>

        {
          !doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
          <>
          
            <Table 
              dataSource={data} pagination={{ pageSize: 20 }}
              rowKey={(record) => record.id}
              expandable={{
                expandedRowRender: (record) => renderVariantTricks(record.trickVariants, record.id),
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
              onCancel={handleCloseModal} 
              onSubmit={handleModalSubmit}
              sportId={sportId}
              categoryId={categoryId}
              trickId={selectedTrickId}
              variants={variants}     
            />
            <EditTrickModal 
              open={isEditModalVisible} 
              onCancel={handleCloseModal} 
              onSubmit={handleModalSubmit} 
              sportId={sportId}
              categoryId={categoryId}
              tricks={data}
              trickEdit={trickEdit}
              difficulties={difficulties}
            />
            <EditTrickVariantModal
              open={isEditVariantModalVisible}
              onCancel={handleCloseModal}
              onSubmit={handleModalSubmit}
              sportId={sportId}
              categoryId={categoryId}
              trick={trickEdit}
              variants={variants}
            />
          </>
        }
      </>
  );
};

export default TricksPage;
