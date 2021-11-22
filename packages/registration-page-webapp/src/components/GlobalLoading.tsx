import Loading from '@/components/Loading';
import React from 'react';

const GlobalLoading: React.FC<{}> = (props) => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loading />
    </div>
  );
};

export default GlobalLoading;
