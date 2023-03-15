import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";
import { getSports } from "../../../api/api";
import { SportPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";

const SportsPage: React.FunctionComponent = () => {
  const [data, setData] = useState<SportPayload[]>();
  const {sessionStorage} = useSessionStorage();
  const history = useHistory();

  const getSportsData = async () => {
    try {
      const data: SportPayload[] = await getSports(sessionStorage?sessionStorage:"");
      setData(data)
    } catch (err) {
      console.log("Failed to reterieve sports")
    }
  }

  const handleEditClick = (id: number) => {
    history.push(`/sports/${id}/edit`);
  }

  const handleAddClick = () => {
    history.push(`/sports/add`);
  }

  const handleDeleteClick = async (id: number) => {
      try {
        console.log("This will cal delete");
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
          <Button onClick={() => handleEditClick(sport.id)}>Edit</Button>
          <Button>
            <DeleteOutlined onClick={() => handleDeleteClick(sport.id)}/>
          </Button>
        </Space>
      </div>
    );
  }, []);

  return ( !data ? <LoadingOutlined style={{ fontSize: 24 }} spin /> :
    <div>
      <div style={{marginBottom: '10px'}}>
        <Button onClick={() => handleAddClick()}>Add Sport</Button>
      </div>

      <Table dataSource={data} pagination={{ pageSize: 20 }}>
        <Table.Column key="index" dataIndex="id" title="Index" width={25}/>
        <Table.Column key="sport" dataIndex="name" title="Sport" />
        <Table.Column
          key="actionColumn"
          render={renderActionColumn}
          fixed="right"
        />
      </Table>
    </div>
  );
};

export default SportsPage;
