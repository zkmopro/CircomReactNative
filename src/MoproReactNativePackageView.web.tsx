import * as React from 'react';

import { MoproReactNativePackageViewProps } from './MoproReactNativePackage.types';

export default function MoproReactNativePackageView(props: MoproReactNativePackageViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
