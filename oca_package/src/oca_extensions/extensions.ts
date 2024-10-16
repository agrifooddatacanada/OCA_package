import Separator, { SeparatorsInput } from './state/overlays/separator.js';
import ExampleOverlaysContainer, { ExampleInput } from './state/overlays/example.js';
import { OcaBundleCaptureBase } from '../oca_package.js';
import { OCABox } from 'oca.js';

interface IExtensionsInputJSON {
  separator_ov: SeparatorsInput;
  examples_ov: ExampleInput[];
}

class Extensions {
  #serialized_extensions: string = '';
  private extension_obj: IExtensionsInputJSON;
  oca_bundle: string;

  constructor(extensions_obj: IExtensionsInputJSON, oca_bundle: string) {
    if (!extensions_obj || !oca_bundle) {
      throw new Error('Invalid constructor arguments');
    }
    this.extension_obj = extensions_obj;
    this.oca_bundle = oca_bundle;
  }

  get ser_extensions(): string {
    return this.#serialized_extensions;
  }

  public get_capture_base_from_oca_bundle(): OcaBundleCaptureBase {
    try {
      const parsedBundle = JSON.parse(this.oca_bundle);
      if (!parsedBundle.bundle) {
        throw new Error('Invalid OCA bundle format');
      }
      const oca_box = new OCABox().load(parsedBundle.bundle);
      return oca_box.generateBundle().capture_base;
    } catch (error) {
      throw new Error(`Failed to get capture base from OCA bundle: ${error}`);
    }
  }

  generate_extensions(): string {
    const extension_overlays: { [key: string]: string } = {};

    try {
      if (this.extension_obj.examples_ov) {
        const examples_ov = new ExampleOverlaysContainer(
          this.extension_obj.examples_ov as ExampleInput[],
          this.get_capture_base_from_oca_bundle(),
        );

        const exampleOverlays = examples_ov.generate_overlay();
        extension_overlays['example'] = Array.isArray(exampleOverlays)
          ? JSON.stringify(exampleOverlays)
          : exampleOverlays;
      }

      if (this.extension_obj.separator_ov) {
        const separator_ov = new Separator(
          this.extension_obj.separator_ov as SeparatorsInput,
          this.get_capture_base_from_oca_bundle(),
        );

        const separatorOverlays = separator_ov.saidifying();
        extension_overlays['separator'] = separatorOverlays;
      }

      const deser_obj: { [key: string]: object } = {};

      for (const key of Object.keys(extension_overlays)) {
        const ov = extension_overlays[key];
        if (typeof ov === 'string') {
          deser_obj[key] = JSON.parse(ov);
        }
      }

      this.#serialized_extensions = JSON.stringify(deser_obj);
      return this.#serialized_extensions;
    } catch (error) {
      throw new Error(`Failed to generate extensions: ${error}`);
    }
  }
}

export default Extensions;
