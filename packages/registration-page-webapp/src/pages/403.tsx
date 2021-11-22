import React from "react";
import { Layout, Result, Button } from "antd";

const { Content } = Layout;

const NotAuth: React.FC<{}> = (props) => {
  return (
    <Content>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button href="/" type="primary">
            Back Home
          </Button>
        }
      />
    </Content>
  );
};

export default NotAuth;
