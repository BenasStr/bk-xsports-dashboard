import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getSport } from "../../../api/api";
import { useHistory } from "react-router-dom";
import { useSessionStorage } from "../../../hooks";

const AccountPage: React.FunctionComponent = () => {
  // const [data, setData] = useState<GetSportPayload>();
  // const {sessionStorage} = useSessionStorage();

  // const getSportData = async () => {
  //   try {
  //     const data: GetSportPayload = await getSport(sessionStorage?sessionStorage:"", 1);
  //     setData(data)
  //   } catch (err) {
  //     console.log("Failed to reterieve sports")
  //   }
  // }

  // useEffect(() => {
  //   getSportData()
  // }, []);

  return (
    <div>
      this is account page
    </div>
  );
};

export default AccountPage;
