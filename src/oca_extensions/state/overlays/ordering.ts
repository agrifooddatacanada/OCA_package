import { ExtensionState } from '../../extensions';
import { getDigest } from '../../../utils/helpers';
import { saidify } from 'saidify';

export interface IOrdering {
  ordering_ov: string[];
}

class Ordering implements IOrdering {
  public ordering_ov: string[];
  public oca_bundle: any;
  private extensionState: ExtensionState;

  constructor(extensionState: ExtensionState, oca_bundle: any) {
    if (!oca_bundle || !extensionState) {
      throw new Error('OCA bundle and ExtensionState are required');
    }
    this.oca_bundle = oca_bundle;
    this.extensionState = extensionState;
    this.ordering_ov = this.getAttributeOrdering();
  }

  private getAttributeOrdering(): string[] {
    return this.extensionState.ordering_arr;
  }

  private getEntryCodeOrdering(): object {
    return this.extensionState.entry_code_ordering_arr;
  }

  private toJSON(): object {
    return {
      d: '',
      type: 'community/adc/ordering/1.0',
      capture_base: getDigest(this.oca_bundle),
      ordering_attribute: this.getAttributeOrdering(),
      entry_code_ordering: this.getEntryCodeOrdering(),
    };
  }

  private saidifying(): Record<string, any> {
    const [, sad] = saidify(this.toJSON());
    return sad;
  }

  public generate_overlay(): string {
    return JSON.stringify(this.saidifying());
  }
}

export default Ordering;
