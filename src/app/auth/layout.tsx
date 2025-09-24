import React, { PropsWithChildren } from 'react';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return <div className='h-screen flex grow items-center justify-center'>{children}</div>;
};

export default AuthLayout;
