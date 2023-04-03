import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Popconfirm, Row, Select, Space, Table, Tag } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { deleteSport, getSports } from "../../../api/api";
import { SportPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";
import AddSportModal from "./AddSportModal";
import EditSportModal from "./EditSportModal";
import SearchInput from "../../generics/Search";

const { Search } = Input;

const SportsPage: React.FunctionComponent = () => {
  const [sports, setSports] = useState<SportPayload[]>();
  const [doneLoading, setLoadingState] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const { sessionStorage } = useSessionStorage();
  const history = useHistory();
  const [sportEdit, setSoprtEdit] = useState<SportPayload>({
    id: 0,
    name: '',
    photo: '',
    variants: []
  });


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

  const getSportsData = async () => {
    try {
      const data: SportPayload[] = await getSports(sessionStorage ? sessionStorage : "");
      setSports(data);
    } catch (err) {
      message.error("Failed to reterieve sports!")
    }
  }

  const onRowClick = (sport: SportPayload, event: MouseEvent) => {
    history.push(`/sports/${sport.id}/categories`);
  };

  const handleEditButtonClick = useCallback((sport: SportPayload) => (event: MouseEvent) => {
    event.stopPropagation();
    setSoprtEdit(sport);
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
    await getSportsData()
    setLoadingState(true)
  }, []);

  const handleSearch = (value: string) => {
    console.log(value);
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

  const rowProps = (sport: SportPayload) => {
    return {
      onClick: (event: MouseEvent) => {
        onRowClick(sport, event);
      },
    };
  };

  useEffect(() => {
    setLoadingState(false);
    getSportsData();
    setLoadingState(true);
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

  return (!doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
    <div>
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
              <Button onClick={() => handleOpenAddModal()}>+ Add Sport</Button>
            </div>
          </Col>
        </Row>
      </div>

      <Table dataSource={sports} pagination={{ pageSize: 20 }} onRow={rowProps}>
        <Table.Column dataIndex="id" title="Index" width={25} />
        <Table.Column dataIndex="name" title="Sport" />
        <Table.Column
          title="Variants"
          render={renderTags}
        />
        <Table.Column
          render={renderActionColumn}
          fixed="right"
        />
      </Table>

      <AddSportModal
        open={isAddModalVisible}
        onCancel={handleCloseAddModal}
        onSubmit={handleAddModalSubmit}
      />
      <EditSportModal
        open={isEditModalVisible}
        onCancel={handleCloseEditModal}
        onSubmit={handleEditModalSubmit}
        sport={sportEdit}
      />
    </div>
  );
};

export default SportsPage;
