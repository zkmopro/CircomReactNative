import { registerWebModule, NativeModule } from 'expo';

import { MoproReactNativePackageModuleEvents, CircomProofResult } from './MoproReactNativePackage.types';

class MoproReactNativePackageModule extends NativeModule<MoproReactNativePackageModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
  generateCircomProof(zkeyPath: string, circuitInputs: string) {
    throw new Error('Not implemented on web');
  }
  verifyProof(zkeyPath: string, proofResult: CircomProofResult) {
    throw new Error('Not implemented on web');
  }
}

export default registerWebModule(MoproReactNativePackageModule);
