import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getSports } from "../../../api/api";
import { GetSportPayload } from "../../../api/apipayloads";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";

const SamplePage: React.FunctionComponent = () => {
  const [data, setData] = useState<GetSportPayload[]>();
  const {sessionStorage} = useSessionStorage();

  const getSportsData = async () => {
    try {
      const data: GetSportPayload[] = await getSports(sessionStorage?sessionStorage:"");
      setData(data)
    } catch (err) {
      console.log("Failed to reterieve sports")
    }
  }

  useEffect(() => {
    getSportsData()
  }, []);

  return (
    <Table dataSource={data} pagination={{ pageSize: 20 }}>
      <Table.Column key="index" dataIndex="id" title="Index" width={25}/>
      <Table.Column key="sport" dataIndex="name" title="SPORT" />
      <Table.Column
        key="actionColumn"
        render={renderActionColumn}
        fixed="right"
      />
    </Table>
  );
};

const renderActionColumn = () => {
  return (
    <div style={{float: "right"}}>
      <Space>
        <Button>Edit</Button>
        <Button>
          <DeleteOutlined />
        </Button>
      </Space>
    </div>
  );
};

export default SamplePage;
