import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export default function stubFunc(W){
  const Comp = ({basePath, uriPrefix, ...rest}) => (
    <W {...rest} />
  );
  return hoistNonReactStatics(Comp, W);
};