import type { CoreStart, CoreSetup, Plugin } from '@kbn/core/public'
import type {
	IndexPatternFieldEditorSetup,
	IndexPatternFieldEditorStart,
} from '@kbn/data-view-field-editor-plugin/public'
import type { FieldFormatsSetup, FieldFormatsStart } from '@kbn/field-formats-plugin/public'
import { UnifiedDocViewerSetup } from '@kbn/unified-doc-viewer-plugin/public';
import type { DataPublicPluginStart } from '@kbn/data-plugin/public';
import { MyFlyoutWrapper } from './my_flyout_wrapper'
import { JsonFormat, JsonFormatEditorFactory } from './json_format'
import type {
  DiscoverSetup,
  DiscoverStart,
} from '@kbn/discover-plugin/public';

type SetupDeps = {
  fieldFormats: FieldFormatsSetup
  dataViewFieldEditor: IndexPatternFieldEditorSetup
  unifiedDocViewer: UnifiedDocViewerSetup
  data: DataPublicPluginStart
  discover: DiscoverSetup;
}
type CoreOpts = {
  fieldFormats: FieldFormatsStart
  dataViewFieldEditor: IndexPatternFieldEditorStart
  data: DataPublicPluginStart
  discover: DiscoverStart
}

export class JsonContentPlugin implements Plugin<void, void, SetupDeps, CoreOpts> {
  public setup(_: CoreSetup<CoreOpts>, deps: SetupDeps) {
    deps.fieldFormats.register([JsonFormat])
		deps.dataViewFieldEditor?.fieldFormatEditors
			?.register(JsonFormatEditorFactory)
    deps.unifiedDocViewer.registry.add({
      id: 'my_view',
      title: 'My View',
      order: 10,
      render: MyFlyoutWrapper
    });
		console.log('json_content: Setup')
	}

  public start() {
    console.log('json_content: STart')
    // discoverStart = plugins.discover;
  }

	public stop() {}
}
