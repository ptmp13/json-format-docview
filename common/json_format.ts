import { createElement } from 'react'
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
    const { isJson, value } = getFormattedJson(String(val));
    // let flyoutClosed = false;
    // Detect if we are inside the DocViewerFlyout
    const inDocViewer =
      typeof document !== 'undefined' &&
      // document.querySelector('.kbnDocViewer');
      // document.querySelector('.kbnDocViewer, .euiDataGridRowCell--popover')
      !!document.querySelector('.euiFlyoutHeader, .euiPopover__panel');

    // const inDocViewerFalse = !!document.querySelector('.TROLROLR');

    // Debug
    // console.log('[json] val:', val);
    // console.log('[json] isJson:', isJson);
    // console.log('[json] inDocViewer:', !!inDocViewer);
    // console.log('[json] flyoutClosed:', flyoutClosed);

    const popover = document.querySelector('[data-popover-open="true"]');

    if (popover) {
      const checkp = popover.querySelector('.unifiedDataTable__cellPopoverValue');
      if (checkp) {
        return `<pre class="json-field">${syntaxHighlightFormattedJson(value)}</pre>`;
      } else {
        return "checkp"
      }
    } else {
      return "popover"
    }
        // const popover = document.querySelector('[data-popover-open="true"]');
    // if (isJson && inDocViewer) {
    //   return `<pre class="json-field">${syntaxHighlightFormattedJson(value)}</pre>`;
    // } else {
    //   return "tororl"
    // }
    // console.log('[json] inDocViewerFalse:', !!inDocViewerFalse);

    // If not JSON or not inside flyout → return plain
    // if (!isJson || inDocViewer) {
    //   return val;
    // }

    // Highlight only inside DocViewerFlyout
    // if (isJson && inDocViewer) {
    //   return "IN!!";
    // }
    // if (isJson && inDocViewer) {
    //   if (flyoutClosed) {
    //     return val
    //   } else {
    //     return `<pre class="json-field">${syntaxHighlightFormattedJson(value)}</pre>`;
    //   }
    // } else {
    //   return val;
    // }

    // return val;
    // if (!inDocViewerFalse) {
    //   return `<pre class="json-field">${syntaxHighlightFormattedJson(value)}</pre>`;
    // } else {
    //   return "zaza"
    // }
  }

	textConvert: TextContextTypeConvert = (val) => {
    function extracted() {
      // console.log('[json] TextContextTypeConvert:', String(val));
      return getFormattedJson(String(val)).value
    }

    return extracted();
  }
}

// add options for the format to be edited if required
const JsonFormatEditor = () => createElement('div', {})

// 2. Make sure it has a `formatId` that corresponds to format's id
JsonFormatEditor.formatId = JsonFormat.id

// 3. Wrap editor component in a factory. This is needed to support and encourage code-splitting.
export const JsonFormatEditorFactory = async() => JsonFormatEditor
JsonFormatEditorFactory.formatId = JsonFormatEditor.formatId

// syntax highlighting for JSON strings
// from ChatGPT
function syntaxHighlightFormattedJson(json: string) {
	// Replace specific parts of the JSON with colored spans
	json = json
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
	return json.replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:\s*)?|(\b(true|false|null)\b)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match, key, stringVal, colon, literal, booleanOrNull, number) => {
		if(key) {
			// If there's a colon after the string, it's a key
			return '<span class="key">' + key + '</span>' + (colon || '')
		} else if(booleanOrNull) {
			// Booleans and null
			return '<span class="boolean">' + booleanOrNull + '</span>'
		} else if(number) {
			// Numbers
			return '<span class="number">' + number + '</span>'
		}

		// Strings
		return '<span class="string">' + match + '</span>'
	})
}

/**
 * Returns a formatted JSON string if the input is a valid JSON string,
 * otherwise returns the input string as is.
 * @param value {"abcd":true}
 * @returns {} '{ isJson: true, value: "{\n \"abcd\": true\n}" }'
 */
function getFormattedJson(value: string) {
	try {
		const obj = JSON.parse(value)
		return {
			isJson: true,
      inDocViewer: false,
			value: JSON.stringify(obj, null, 2)
		}
	} catch{
		return { isJson: false, inDocViewer: false, value }
	}
}
