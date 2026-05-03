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
}

	// 4. Implement a conversion function
  // htmlConvert: HtmlContextTypeConvert = (val,opts) => {
  //   const { isJson, inDocViewer, value } = getFormattedJson(String(val));
  //   console.log('inDocViewer: ',inDocViewer);
  //   console.log('val: ',val);

  //   // Debug
  //   // console.log('[json] val:', val);
  //   // console.log('[json] isJson:', isJson);
  //   // console.log('[json] inDocViewer:', !!inDocViewer);
  //   // console.log('[json] flyoutClosed:', flyoutClosed);

  //   // If not JSON or not inside flyout → return plain
  //   if (!isJson) {
  //     return val;
  //   }
  //   return `<pre class="json-field">${syntaxHighlightFormattedJson(value)}</pre>`;
  // }

	// textConvert: TextContextTypeConvert = (val) => {
  //   function extracted() {
  //     // console.log('[json] TextContextTypeConvert:', String(val));
  //     return getFormattedJson(String(val)).value
  //   }

  //   return extracted();
  // }
// }

// add options for the format to be edited if required
// const JsonFormatEditor = () => createElement('div', {})

// // 2. Make sure it has a `formatId` that corresponds to format's id
// JsonFormatEditor.formatId = JsonFormat.id

// // 3. Wrap editor component in a factory. This is needed to support and encourage code-splitting.
// export const JsonFormatEditorFactory = async() => JsonFormatEditor
// JsonFormatEditorFactory.formatId = JsonFormatEditor.formatId

// syntax highlighting for JSON strings
// from ChatGPT
// function syntaxHighlightFormattedJson(json: string) {
// 	// Replace specific parts of the JSON with colored spans
// 	json = json
// 		.replace(/&/g, '&amp;')
// 		.replace(/</g, '&lt;')
// 		.replace(/>/g, '&gt;')
// 	return json.replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:\s*)?|(\b(true|false|null)\b)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match, key, stringVal, colon, literal, booleanOrNull, number) => {
// 		if(key) {
// 			// If there's a colon after the string, it's a key
// 			return '<span class="key">' + key + '</span>' + (colon || '')
// 		} else if(booleanOrNull) {
// 			// Booleans and null
// 			return '<span class="boolean">' + booleanOrNull + '</span>'
// 		} else if(number) {
// 			// Numbers
// 			return '<span class="number">' + number + '</span>'
// 		}

// 		// Strings
// 		return '<span class="string">' + match + '</span>'
// 	})
// }

/**
 * Returns a formatted JSON string if the input is a valid JSON string,
 * otherwise returns the input string as is.
 * @param value {"abcd":true}
 * @returns {} '{ isJson: true, value: "{\n \"abcd\": true\n}" }'
 */
// function getFormattedJson(value: string) {
// 	try {
// 		const obj = JSON.parse(value)
// 		return {
// 			isJson: true,
//       inDocViewer: true,
// 			value: JSON.stringify(obj, null, 2)
// 		}
// 	} catch{
// 		return { isJson: false, inDocViewer: false, value }
// 	}
// }
