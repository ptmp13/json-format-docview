import type { CoreSetup, CoreStart, Plugin } from '@kbn/core/server';
import type { FieldFormatsSetup, FieldFormatsStart } from '@kbn/field-formats-plugin/server';
import { registerJsonFormat } from './json_format';

interface SetupDeps {
  fieldFormats: FieldFormatsSetup;
}

interface StartDeps {
  fieldFormats: FieldFormatsStart;
}

export class FieldFormatsJsonPlugin implements Plugin<void, void, SetupDeps, StartDeps> {
  public setup(core: CoreSetup<StartDeps>, deps: SetupDeps) {
    registerJsonFormat(deps.fieldFormats);
  }
  public start(core: CoreStart) {
    return {};
  }
  public stop() {}
}
