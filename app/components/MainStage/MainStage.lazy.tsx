import React, { lazy, Suspense } from 'react';

const LazyMainStage = lazy(() => import('./MainStage'));

const MainStage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyMainStage {...props} />
  </Suspense>
);

export default MainStage;
