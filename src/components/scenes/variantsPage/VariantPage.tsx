import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Table } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { deleteVariant, getVariants } from "../../../api/api";
import { VariantPayload } from "../../../api/apipayloads";
import { useSessionStorage } from "../../../hooks";
import AddVariantModal from "./AddVariantModal";
import EditVariantModal from "./EditVariantModal";


const VariantPage: React.FunctionComponent = () => {
  const [variants, setVariants] = useState<VariantPayload[]>();
  const [doneLoading, setLoadingState] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const {sessionStorage} = useSessionStorage();
  const [variantEdit, setVariantEdit] = useState<VariantPayload>({
    id: 0,
    name: ''
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
    getVariantsData();
  }, []) 

  const handleCloseEditModal = useCallback(() => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  }, []);

  const handleEditModalSubmit = useCallback(() => {
    setIsEditModalVisible(false);
    getVariantsData();
  }, []);
  
  const handleEditButtonClick = useCallback((variant: VariantPayload) => (event: MouseEvent)  => {
    event.stopPropagation();
    setVariantEdit(variant)
    setIsEditModalVisible(true);
  }, [])

  const getVariantsData = async () => {
    try {
      setLoadingState(false);
      const data: VariantPayload[] = await getVariants(sessionStorage?sessionStorage:"");
      setVariants(data);
      setLoadingState(true);
    } catch (err) {
      message.error("Failed to retrieve variants!")
    }
  }

  const handleDeleteClick = async (id: number) => {
    setLoadingState(false);
      try {
        await deleteVariant(sessionStorage?sessionStorage : "", id);
        message.success("Deleted variant!")
      } catch(err) {
        message.error("Unable to delete variant!")
      }
      await getVariantsData();
      setLoadingState(true)
  }

  useEffect(() => {
    getVariantsData()
  }, []);

  const renderActionColumn = useCallback((variant: VariantPayload) => {
    return (
      <div style={{float: "right"}}>
        <Space>
          <Button onClick={handleEditButtonClick(variant)}>Edit</Button>

          <Popconfirm
            placement="topRight"
            title={"Delete this variant?"}
            onConfirm={() => handleDeleteClick(variant.id)}
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

  return ( !doneLoading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
    <div>
      <div style={{marginBottom: '10px', float:'right'}}>
        <Button onClick={() => handleOpenAddModal()}>+ Add Variant</Button>
      </div>

      <Table dataSource={variants} pagination={{ pageSize: 20 }}>
        <Table.Column dataIndex="id" title="Index" width={25}/>
        <Table.Column dataIndex="name" title="Variant"/>
        <Table.Column
          render={renderActionColumn}
          fixed="right"
        />
      </Table>

      <AddVariantModal open={isAddModalVisible} onCancel={handleCloseAddModal} onSubmit={handleAddModalSubmit}/>
      <EditVariantModal open={isEditModalVisible} onCancel={handleCloseEditModal} onSubmit={handleEditModalSubmit} variant={variantEdit}/>
    </div>
  );
};

export default VariantPage;
