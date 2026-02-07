import { NativeModule, requireNativeModule } from 'expo';

import {
  MoproReactNativePackageModuleEvents,
  Result,
  CircomProofResult,
  CircomProofLib,
} from './MoproReactNativePackage.types';

declare class MoproReactNativePackageModule extends NativeModule<MoproReactNativePackageModuleEvents> {
  PI: number;
  hello(): string;
  generateCircomProof(zkeyPath: string, circuitInputs: string, proofLib: CircomProofLib): Promise<CircomProofResult>;
  circomProve(graphPath: string, circuitInputs: string, zkeyPath: string): Promise<CircomProofResult>;
  verifyCircomProof(zkeyPath: string, proofResult: CircomProofResult, proofLib: CircomProofLib): Promise<boolean>;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MoproReactNativePackageModule>('MoproReactNativePackage');
