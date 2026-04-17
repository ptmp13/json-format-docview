import type { CoreSetup, Plugin } from '@kbn/core/public'
import type {
	IndexPatternFieldEditorSetup,
	IndexPatternFieldEditorStart,
} from '@kbn/data-view-field-editor-plugin/public'
import type { FieldFormatsSetup, FieldFormatsStart } from '@kbn/field-formats-plugin/public'
import { JsonFormat, JsonFormatEditorFactory } from './json_format'

type SetupDeps = {
  fieldFormats: FieldFormatsSetup
  dataViewFieldEditor: IndexPatternFieldEditorSetup
}

type CoreOpts = {
  fieldFormats: FieldFormatsStart
  dataViewFieldEditor: IndexPatternFieldEditorStart
}

export class JsonContentPlugin implements Plugin<void, void, SetupDeps, CoreOpts> {
	public setup(_: CoreSetup<CoreOpts>, deps: SetupDeps) {
		deps.fieldFormats.register([JsonFormat])
		deps.dataViewFieldEditor?.fieldFormatEditors
			?.register(JsonFormatEditorFactory)
		console.log('json_content: Setup')

	}

	public start() {
		return {}
	}

	public stop() {}
}
