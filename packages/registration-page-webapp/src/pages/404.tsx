import React from 'react';
import { Layout, Result, Button } from 'antd';

const { Content } = Layout;

const NotFound: React.FC<{}> = (props) => {
  return (
    <Content>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button href="/" type="primary">
            Back Home
          </Button>
        }
      />
    </Content>
  );
};

export default NotFound;
