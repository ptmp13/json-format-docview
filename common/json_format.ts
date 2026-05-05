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
}

// add options for the format to be edited if required
const JsonFormatEditor = () => createElement('div', {})

// 2. Make sure it has a `formatId` that corresponds to format's id
JsonFormatEditor.formatId = JsonFormat.id

// 3. Wrap editor component in a factory. This is needed to support and encourage code-splitting.
export const JsonFormatEditorFactory = async() => JsonFormatEditor
JsonFormatEditorFactory.formatId = JsonFormatEditor.formatId