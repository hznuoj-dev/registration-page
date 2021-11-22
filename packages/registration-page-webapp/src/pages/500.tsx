import React from "react";
import { Layout, Result, Button } from "antd";

const { Content } = Layout;

const NetWorkWrong: React.FC<{}> = (props) => {
  return (
    <Content>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={
          <Button href="/" type="primary">
            Back Home
          </Button>
        }
      />
    </Content>
  );
};

export default NetWorkWrong;
