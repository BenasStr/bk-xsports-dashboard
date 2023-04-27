import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Popconfirm, Row, Select, SelectProps, Space, Table, Tag } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { deleteSport, getSports } from "../../../api/xsports/sportsApi";
import { SportPayload, VariantPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";
import AddSportModal from "./AddSportModal";
import EditSportModal from "./EditSportModal";
import SearchInput from "../../generics/Search";
import { getColorBasedOnPublishStatus, getStatuses } from "../../../utils/utils";
import { getVariants } from "../../../api/xsports/variantsApi";

const SportsPage: React.FunctionComponent = () => {
  const [sports, setSports] = useState<SportPayload[]>();
  const [doneLoading, setLoadingState] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [variants, setVariants] = useState<VariantPayload[]>([]);
  const { sessionStorage } = useSessionStorage();
  const history = useHistory();
  const [sportEdit, setSoprtEdit] = useState<SportPayload>({
    id: 0,
    name: '',
    photo: '',
    publishStatus: '',
    contentStatus: '',
    lastUpdated: '',
    categoriesCount: 0,
    variants: []
  });

  const handleOpenAddModal = useCallback(() => {
    getVariantsData()
    setIsAddModalVisible(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleAddModalSubmit = useCallback(() => {
    setIsAddModalVisible(false);
    getSportsData("");
  }, [])

  const handleCloseEditModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleEditModalSubmit = useCallback(() => {
    setIsEditModalVisible(false);
    getSportsData("");
  }, []);

  const getSportsData = async (search: string) => {
    setLoadingState(false);
    try {
      const data: SportPayload[] = await getSports(sessionStorage ? sessionStorage : "", search, selectedStatus?selectedStatus:"");
      setSports(data);
    } catch (err) {
      message.error("Failed to reterieve sports!")
    }
    setLoadingState(true);
  }

  const getVariantsData = async () => {
    try {
      const data: VariantPayload[] = await getVariants(sessionStorage ? sessionStorage : "");
      data.forEach((variant) => {
        if (variant.name === "Standard") {
          data.splice(data.indexOf(variant), 1)
        }
      });
      setVariants(data);
    } catch (err) {
      message.error("Failed to retrieve variants!");
    }
  }

  const onRowClick = (sport: SportPayload, event: MouseEvent) => {
    history.push(`/sports/${sport.id}/categories`);
  };

  const handleEditButtonClick = useCallback((sport: SportPayload) => (event: MouseEvent) => {
    event.stopPropagation();
    setSoprtEdit(sport);
    getVariantsData();
    setIsEditModalVisible(true);
  }, []);

  const handleDeleteClick = useCallback((id: number) => async (event: MouseEvent) => {
    event.stopPropagation();
    setLoadingState(false);
    try {
      await deleteSport(sessionStorage ? sessionStorage : "", id);
      message.success("Deleted sport!")
    } catch (err) {
      message.error("Unable to delete sport!")
    }
    await getSportsData("")
    setLoadingState(true)
  }, []);

  const handleSearch = (value: string) => {
    getSportsData(value);
  }

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

  const renderStatus = useCallback((sport: SportPayload) => {
    const color = getColorBasedOnPublishStatus(sport.publishStatus);
    return (
      <>
        <Tag color={color} key={sport.id}>
          {sport.publishStatus.toLocaleUpperCase()}
        </Tag>
      </>
    )
  }, []);

  const renderContentStatus = useCallback((sport: SportPayload) => {
    const color = getColorBasedOnPublishStatus(sport.contentStatus);
    return (
      <>
        <Tag color={color} key={sport.id}>
          {sport.contentStatus.toLocaleUpperCase()}
        </Tag>
      </>
    )
  }, []);

  const rowProps = (sport: SportPayload) => {
    return {
      onClick: (event: MouseEvent) => {
        onRowClick(sport, event);
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
    setSelectedStatus(value);
  };
  
  const clearSelectedState = () => {
    setSelectedStatus(undefined)
  }

  useEffect(() => {
    getSportsData("");
  }, []);

  const renderActionColumn = useCallback((sport: SportPayload) => {
    return (
      <div style={{ float: "right" }}>
        <Space>
          <Button onClick={handleEditButtonClick(sport)}>
            Edit
          </Button>

          <Popconfirm
            onClick={(e: MouseEvent) => e.stopPropagation()}
            placement="topRight"
            title={"Delete this sport?"}
            onConfirm={handleDeleteClick(sport.id)}
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
        <Row gutter={[8, 8]}>
          <Col span={8}>
            <SearchInput onSearch={handleSearch}/>
          </Col>

          <Col span={8}>
            <Select 
              allowClear
              onClear={clearSelectedState}
              onChange={handleChange}
              placeholder="Status Filter" 
              options={mapToSelectProps()}
              style={{ width: '160px' }}/>
          </Col>

          <Col span={8}>
            <div style={{float: 'right'}}>
              <Button onClick={() => handleOpenAddModal()}>+ Add Sport</Button>
            </div>
          </Col>
        </Row>
      </div>

      {
        !doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
        <>
          <Table dataSource={sports} pagination={{ pageSize: 20 }} onRow={rowProps}>
            <Table.Column dataIndex="id" title="Index" width={25} />

            <Table.Column dataIndex="name" title="Sport" />

            <Table.Column title="Variants" render={renderTags}/>

            <Table.Column title="Status" render={renderStatus}/>

            <Table.Column dataIndex="lastUpdated" title="Last Updated"/>

            <Table.Column dataIndex="categoriesCount" title = "Categories Count"/>

            <Table.Column title = "Content Status" render={renderContentStatus}/>

            <Table.Column render={renderActionColumn} fixed="right"/>
          </Table>

          <AddSportModal
            open={isAddModalVisible}
            onCancel={handleCloseAddModal}
            onSubmit={handleAddModalSubmit}
            variants={variants}
          />
          
          <EditSportModal
            open={isEditModalVisible}
            onCancel={handleCloseEditModal}
            onSubmit={handleEditModalSubmit}
            sport={sportEdit}
            variants={variants}
          />
        </>
      }
    </div>
  );
};

export default SportsPage;
