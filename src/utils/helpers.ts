import { Said, OcaBundleCaptureBase } from '../types/types';

// Get capture base from the OCA bundle
export const getCaptureBase = (oca_bundle: any): OcaBundleCaptureBase => {
  // console.log('here oca_bundle:', oca_bundle);

  try {
    if (!oca_bundle) {
      throw new Error('OCA bundle is undefined or null.');
    }
    if (!oca_bundle.bundle) {
      throw new Error('OCA bundle does not contain a bundle property.');
    }
    if (!oca_bundle.bundle.capture_base) {
      throw new Error('OCA bundle does not contain a capture_base property.');
    }
    return oca_bundle.bundle.capture_base;
  } catch (error) {
    console.error('Error in getting capture base:', error);
    throw new Error(`Failed to get the capture base from the OCA bundle: ${error.message}`);
  }
};

// Validate if the attribute exists in the OCA bundle capture base
export const isPresent = (attribute: string, oca_bundle: any): boolean => {
  try {
    const capture_base = getCaptureBase(oca_bundle);
    if (!capture_base.attributes) {
      throw new Error('OCA bundle capture_base does not contain attributes.');
    }
    return attribute in capture_base.attributes;
  } catch (error) {
    console.error('Error in validation:', error);
    throw new Error(`Failed to check if the attribute is present in the capture base: ${error.message}`);
  }
};

// Get the said (digest) from the OCA bundle capture base
export const getDigest = (oca_bundle: any): Said => {
  try {
    const capture_base = getCaptureBase(oca_bundle);
    return capture_base.d;
  } catch (error) {
    console.error('Error in getting said:', error);
    throw new Error(`Failed to get the said from the capture base: ${error.message}`);
  }
};