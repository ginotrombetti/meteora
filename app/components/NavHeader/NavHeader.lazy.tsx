import React, { lazy, Suspense } from 'react';

const LazyNavHeader = lazy(() => import('./NavHeader'));

const NavHeader = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyNavHeader {...props} />
  </Suspense>
);

export default NavHeader;
