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

