import { describe, it, expect } from 'vitest';
import OcaPackage from '../src/oca_package.js';
import Extensions from '../src/oca_extensions/extensions.js';
import path from 'path';
import fs from 'fs';

describe('oca_package', () => {
  it('should check if an oca_package is deterministic', () => {
    // Load the OCA bundle
    const oca_bundle_path = path.join(__dirname, '../bundles', 'oca_bundle.json');
    const oca_bundle = fs.readFileSync(oca_bundle_path, 'utf8');

    // Load the extension
    const extension_path = path.join(__dirname, '../bundles', 'extension.json');
    const extension_obj = JSON.parse(fs.readFileSync(extension_path, 'utf8'));

    // Create instances of the OcaPackage and Extensions classes
    const extensions = new Extensions(extension_obj, oca_bundle);
    const ocaPackage = new OcaPackage(extensions, oca_bundle);

    const reversed_extension_obj = {
      examples_ov: [
        {
          type: 'example',
          language: 'fra',
          attribute_examples: {
            d: ['va', 'aller'],
            i: ['toi', 'moi'],
          },
        },
        {
          type: 'example',
          language: 'eng',
          attribute_examples: {
            d: ['come', 'go'],
            i: ['me', 'you'],
          },
        },
      ],
      separator_ov: {
        type: 'separator',
        dataset_separator: {
          delimiter: ',',
          escape: '\\',
        },
        attribute_separators: {
          d: {
            delimiter: ',',
            escape: '\\',
          },
          i: {
            delimiter: ';',
            escape: '',
          },
        },
      },
    };

    const reversed_extensions = new Extensions(reversed_extension_obj, oca_bundle);
    const reversedOcaPackage = new OcaPackage(reversed_extensions, oca_bundle);

    expect(ocaPackage.said()).toEqual('EIc5n0Q5QzChXlJZnIAk7KbhmEFZuI5dLA2pVbRrrcjH');
    expect(reversedOcaPackage.said()).toEqual(ocaPackage.said());
  });
});
