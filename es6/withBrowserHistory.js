import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export default function stubFunc(W){
  const Comp = class extends React.Component {
    render() {
      const { navigatorRef, basePath, uriPrefix, ...rest } = this.props;

      return (
        <W
          ref={ref => {
            navigatorRef && navigatorRef(ref);
          }}
          {...rest}
        />
      )
    }
  }

  return hoistNonReactStatics(Comp, W);
};
