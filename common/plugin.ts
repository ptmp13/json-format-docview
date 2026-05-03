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
import { type UiActionsSetup, type UiActionsStart } from '@kbn/ui-actions-plugin/public';

type SetupDeps = {
  fieldFormats: FieldFormatsSetup
  dataViewFieldEditor: IndexPatternFieldEditorSetup
  unifiedDocViewer: UnifiedDocViewerSetup
  data: DataPublicPluginStart
  discover: DiscoverSetup;
  uiActions: UiActionsSetup
}
type CoreOpts = {
  fieldFormats: FieldFormatsStart
  dataViewFieldEditor: IndexPatternFieldEditorStart
  data: DataPublicPluginStart
  uiActions: UiActionsStart
  discover: DiscoverStart
}

export class JsonContentPlugin implements Plugin<void, void, SetupDeps, CoreOpts> {
  public setup(_: CoreSetup<CoreOpts>, deps: SetupDeps) {
    deps.fieldFormats.register([JsonFormat])
		deps.dataViewFieldEditor?.fieldFormatEditors
			?.register(JsonFormatEditorFactory)

    deps.uiActions.registerAction({
      id: 'my-row-click-logger',
      type: 'my-row-click-logger',
      getDisplayName: () => 'Log Row',
      isCompatible: async () => true,
      execute: async (ctx) => {
        console.log('🟢 ROW CLICKED', ctx);
      },
    });

    deps.unifiedDocViewer.registry.add({
      id: 'my_view',
      title: 'My View',
      order: 10,
      render: MyFlyoutWrapper
    });
	}

  public start(_: CoreStart, plugins: CoreOpts) {
    console.log('json_content: Start');
    const allTriggers = (plugins.uiActions as any).triggers ??
      (plugins.uiActions as any)._triggers ??
      (plugins.uiActions as any).triggerToActions;
    console.log('all triggers:', allTriggers);
    // Log all known triggers to find the right one
    try {
      const triggers = (plugins.uiActions as any).triggers;
      console.log('Available triggers:', Object.keys(triggers ?? {}));
    } catch (e) {
      console.warn('Could not read triggers', e);
    }
    // discoverStart = plugins.discover;
  }

	public stop() {}
}
