import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";

const SamplePage: React.FunctionComponent = () => {
  const data = mockData;

  return (
    <Table dataSource={data} pagination={{ pageSize: 3 }}>
      <Table.Column key="index" dataIndex="index" title="Index" />
      <Table.Column key="guid" dataIndex="guid" title="GUID" />
      <Table.Column key="balance" dataIndex="balance" title="Balance" />
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
    <div>
      <Space>
        <Button>Edit</Button>
        <Button>
          <DeleteOutlined />
        </Button>
      </Space>
    </div>
  );
};

const mockData = [
  {
    _id: "6404ac46009401e683ece1d1",
    index: 0,
    guid: "2e8087f0-c082-4a13-8cc9-5babe633bc31",
    isActive: false,
    balance: "$1,749.48",
    picture: "http://placehold.it/32x32",
  },
  {
    _id: "6404ac46ab4fa82364132a01",
    index: 1,
    guid: "deb77ba3-7bce-4917-bcce-0962d6417722",
    isActive: true,
    balance: "$3,805.25",
    picture: "http://placehold.it/32x32",
  },
  {
    _id: "6404ac4601a19b019dc06333",
    index: 2,
    guid: "00e6d02b-c3a0-4500-962a-bf9ca583f411",
    isActive: false,
    balance: "$1,535.13",
    picture: "http://placehold.it/32x32",
  },
  {
    _id: "6404ac46f10c58e90747a5ff",
    index: 3,
    guid: "423c33e8-3d71-4fd5-b8d3-791d1b829708",
    isActive: true,
    balance: "$3,737.04",
    picture: "http://placehold.it/32x32",
  },
  {
    _id: "6404ac4695d9eaa76807f242",
    index: 4,
    guid: "4b9cf99a-f353-4e76-95e4-3a14135c4b7d",
    isActive: false,
    balance: "$3,704.37",
    picture: "http://placehold.it/32x32",
  },
  {
    _id: "6404ac467e0b516732883185",
    index: 5,
    guid: "c0a68f07-c815-4fd8-b5c9-957a367a60e1",
    isActive: true,
    balance: "$1,939.27",
    picture: "http://placehold.it/32x32",
  },
];

export default SamplePage;
