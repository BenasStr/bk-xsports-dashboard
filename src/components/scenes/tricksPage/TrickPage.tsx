import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, message, Popconfirm, Row, Select, SelectProps, Space, Table, Tag } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { getTricks, deleteTrick, deleteTrickVariant } from "../../../api/xsports/tricksApi";
import { getSport } from "../../../api/xsports/sportsApi";
import { getDifficulties } from "../../../api/xsports/difficultiesApi";
import { DifficultyPayload, TrickBasicPayload, TrickPayload, SportPayload, VariantPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";
import AddTrickModal from "./AddTrickModal";
import AddTrickVariantModal from "./AddTrickVariantModal";
import EditTrickModal from "./EditTrickModal";
import EditTrickVariantModal from "./EditTrickVariantModal";
import SearchInput from "../../generics/Search";
import { getColorBasedOnPublishStatus, getDifficultiesStrings, getStatuses } from "../../../utils/utils";

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

  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>(undefined);
  const [selectedMissingVideo, setSelectedMissingVideo] = useState<string | undefined>(undefined);
  const [selectedMissingVaraints, setSelectedMissingVariants] = useState<string | undefined>(undefined);

  const { sessionStorage } = useSessionStorage();
  const [trickEdit, setTrickEdit] = useState<TrickPayload>({
    id: 0,
    trickId: 0,
    name: '',
    shortDescription: '',
    description: '',
    difficulty: '',
    videoUrl: '',
    baseVariantId: 0,
    publishStatus: '',
    lastUpdated: '',
    variantsCreated: '',
    trickParents: [],
    trickChildren: [],
    trickVariants: []
  });

  const [trickVariantEdit, setTrickVariantEdit] = useState<TrickBasicPayload>({
    id: 0,
    trickId: 0,
    name: '',
    shortDescription: '',
    description: '',
    baseVariantId: 0,
    videoUrl: '',
    variantId: 0
  })

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
    getTricksData("");
  }, []);

  const handleEditButtonClick = useCallback((trick: TrickPayload) => (event: any) => {
    event.stopPropagation();
    setTrickEdit(trick);
    setIsEditModalVisible(true);
  }, []);

  const handleEditVariantButtonClick = useCallback((trick: TrickPayload, trickVariant: TrickBasicPayload) => (event: any) => {
    event.stopPropagation();
    console.log(trick);
    console.log(trickVariant);
    setTrickEdit(trick)
    setTrickVariantEdit(trickVariant);
    setIsEditVariantModalVisible(true);
  }, []);

  const getTricksData = async (search: string) => {
    try {
      setLoadingState(false);
      const data: TrickPayload[] = await getTricks(sessionStorage ? sessionStorage : "", sportId, categoryId, search);
      console.log(data)
      setData(data);
      console.log(data);
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
    await getTricksData("");
    setLoadingState(true)
  }, []);

  const handleVariantDeleteClick = useCallback((trickId: number, variantId: number) => async (event: any) => {
    event.stopPropagation();
    setLoadingState(false);
    try {
      await deleteTrickVariant(sessionStorage ? sessionStorage : "", sportId, categoryId, trickId, variantId);
      message.success("Deleted variant!");
    } catch (err) {
      console.log(err);
      message.error("Failed to delete trick!");
    }
    await getTricksData("");
    setLoadingState(true)
  }, []);

  const handleSearch = (value: string) => {
    getTricksData(value)
  };

  const renderStatus = useCallback((trick: TrickPayload) => {
    const color = getColorBasedOnPublishStatus(trick.publishStatus);
    return (
      <>
        <Tag color={color} key={trick.id}>
          {trick.publishStatus.toLocaleUpperCase()}
        </Tag>
      </>
    )
  }, []);

  const mapToSelectProps = (): SelectProps["options"] => {
    return getStatuses().map((status) => {
      return {
        value: status,
        label: status
      }});
  };

  const mapToDifficultyProps = (): SelectProps["options"] => {
    return getDifficultiesStrings().map((difficulty) => {
      return {
        value: difficulty,
        label: difficulty
      }
    })
  }

  const mapToBooleanProps = (): SelectProps["options"] => {
    return [
      {
        value: "true",
        label: "True"
      },
      {
        value: "false",
        label: "False"
      },
      {
        value: "All",
        label: "All"
      }
    ]
  }

  const handleStatusFilter = (value: string) => {
    if (value === "All" || value === undefined) {
      setSelectedStatus(undefined);
    } else {
      setSelectedStatus(value);
    }
  };

  const handleDifficultyFilter = (value: string) => {
    if (value === "All" || value === undefined) {
      setSelectedDifficulty(undefined);
    } else {
      setSelectedDifficulty(value);
    }
  };

  const handleMissingVideoFilter = (value: string) => {
    if (value === "All" || value === undefined) {
      setSelectedMissingVideo(undefined);
    } else {
      setSelectedMissingVideo(value);
    }
  };

  const handleMissingVariantsFilter = (value: string) => {
    if (value === "All" || value === undefined) {
      setSelectedMissingVariants(undefined);
    } else {
      setSelectedMissingVariants(value);
    }
  };

  const clearSelectedState = () => {
    setSelectedStatus(undefined)
  }

  const clearSelectedDifficulty = () => {
    setSelectedDifficulty(undefined)
  }

  const clearSelectedMissingVideo = () => {
    setSelectedMissingVideo(undefined)
  }

  const clearSelectedMissingVariant = () => {
    setSelectedMissingVariants(undefined)
  }

  useEffect(() => {
    getTricksData("")
    getDifficultiesData()
    getSportVariants()
  }, []);

  const renderVariantTricks = useCallback((trick: TrickPayload) => {
    return(
      <Table dataSource={trick.trickVariants} pagination={false} showHeader={false}>
        <Table.Column dataIndex="id" width={70}/>
        <Table.Column dataIndex="name"/>
        <Table.Column
            render={renderVariantActionColumn(trick)}
            fixed="right"
          />
      </Table>
    );
  }, []);

  const renderMissingVideo = useCallback((trick: TrickPayload) => {
    if (trick.videoUrl == null) {
      return (
        <Tag color="red">MISSING VIDEO</Tag>
      );
    }
  }, []);

  const renderVariantActionColumn = useCallback((trick: TrickPayload) => (trickVariant: TrickBasicPayload) => {
    return (
      <div style={{ float: "right" }}>
        <Space>
          <Button onClick={handleEditVariantButtonClick(trick, trickVariant)}>
            Edit
          </Button>

          <Popconfirm
          //@ts-ignore
            onClick={(e: MouseEvent) => e.stopPropagation()}
            placement="topRight"
            title={"Delete this trick variant?"}
            onConfirm={handleVariantDeleteClick(trick.id, trickVariant.id)}
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
            onConfirm={handleTrickDeleteClick(trick.trickId)}
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
            <Col span={5}>
              <SearchInput onSearch={handleSearch}/>
            </Col>

            <Col span={14}>
              <Select 
                allowClear
                value={selectedStatus}
                onClear={clearSelectedState}
                onChange={handleStatusFilter}
                placeholder="Status Filter" 
                options={mapToSelectProps()}
                style={{ width: '190px', marginRight: '10px'}}/>

              <Select
                allowClear
                value={selectedDifficulty}
                onClear={clearSelectedDifficulty}
                onChange={handleDifficultyFilter}
                placeholder="Difficulty Filter" 
                options={mapToDifficultyProps()}
                style={{ width: '190px', marginRight: '10px' }}/>

              <Select
                allowClear
                value={selectedMissingVideo}
                onClear={clearSelectedMissingVideo}
                onChange={handleMissingVideoFilter}
                placeholder="Missing Video Filter" 
                options={mapToBooleanProps()}
                style={{ width: '190px', marginRight: '10px' }}/>

              <Select
                allowClear
                value={selectedMissingVaraints}
                onClear={clearSelectedMissingVariant}
                onChange={handleMissingVariantsFilter}
                placeholder="Missing Variants Filter" 
                options={mapToBooleanProps()}
                style={{ width: '190px' }}/>
            </Col>

            <Col span={5}>
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
                expandedRowRender: (record) => renderVariantTricks(record),
                rowExpandable: (record) => record.trickVariants.length > 0,
              }}  
            >
              <Table.Column dataIndex="trickId" title="Index" width={25} />
              <Table.Column dataIndex="name" title="Trick" />
              <Table.Column dataIndex="difficulty" title="Difficulty" />
              <Table.Column title="Status" render={renderStatus}/>
              <Table.Column dataIndex="variantsCreated" title="Variants Created"/>
              <Table.Column dataIndex="lastUpdated" title="Last Updated"/>
              <Table.Column render={renderMissingVideo} title="Missing"/>
              <Table.Column render={renderActionColumn} fixed="right"/>
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
              trickVariant={trickVariantEdit}
              />
          </>
        }
      </>
  );
};

export default TricksPage;
