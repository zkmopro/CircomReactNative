// Reexport the native module. On web, it will be resolved to MoproReactNativePackageModule.web.ts
// and on native platforms to MoproReactNativePackageModule.ts
export { default } from './MoproReactNativePackageModule';
export { default as MoproReactNativePackageView } from './MoproReactNativePackageView';
export * from './MoproReactNativePackage.types';