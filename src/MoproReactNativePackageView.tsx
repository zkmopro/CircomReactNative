import { requireNativeView } from 'expo';
import * as React from 'react';

import { MoproReactNativePackageViewProps } from './MoproReactNativePackage.types';

const NativeView: React.ComponentType<MoproReactNativePackageViewProps> =
  requireNativeView('MoproReactNativePackage');

export default function MoproReactNativePackageView(props: MoproReactNativePackageViewProps) {
  return <NativeView {...props} />;
}
