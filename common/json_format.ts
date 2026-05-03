import { FieldFormat, FieldFormatParams, type HtmlContextTypeConvert, type TextContextTypeConvert } from '@kbn/field-formats-plugin/common'
import { KBN_FIELD_TYPES } from '@kbn/field-types'

// 1. Create a custom formatter by extending {@link FieldFormat}

export class JsonFormat extends FieldFormat {
	static id = 'json'
	static title = 'JSON'

	// 2. Specify field types that this formatter supports
	static fieldType = KBN_FIELD_TYPES.STRING

	getParamDefaults(): FieldFormatParams {
		return {}
	}

	// 4. Implement a conversion function
  htmlConvert: HtmlContextTypeConvert = (val,opts) => {
    console.log('val: ',val);
    const highlights = opts?.hit?.highlight;
    console.log('Available fields in this opts:', Object.keys(opts?.hit || {}));
    console.log('highlights:', highlights);
    if (highlights) {
      // TypeScript now knows 'highlights' is an object
      const highlightKeys = Object.keys(highlights);
      const targetKey = highlightKeys.find(key => key.includes('GGGG'));

      if (targetKey) {
        const highlightedValue = highlights[targetKey];
        console.log('Found highlight:', highlightedValue);
        // Use highlightedValue here
      }
    }
    return val;
  }
}

