# Some fix

1. Format JSON only in DocView Tab.
2. Add Server Side for import from terraform like using elasticstack_kibana_data_view module.
field_formats id is __'json'__
3. Test it work in Kibana 9.3.0

![DocView Tab 1](/images/docview-highlight.png)
![DocView Tab 2(EuiCode)](/images/docview-highlight.png)


# Kibana

Just view json content of field. on Docview Tab.

## Installation

1. Install in Kibana via:
   ```bash
   bin/kibana-plugin install https://github.com/ptmp13/kibana-json-content/releases/download/v9.3.0/jsonContent-9.3.0.zip
   ```

## Usage

1. Open your Discover/Logs tab & select the field you'd like to print as JSON. This must be some string field. See this [guide](https://www.elastic.co/guide/en/kibana/8.15/managing-data-views.html#managing-fields)
2. Enable the "Set format", and select JSON:
   ![Set format](/images/set-format.png)
3. Click save & close the field editor.
4. Now, you can see the JSON content pretty printed in the console!

## Development

1. Setup the Kibana development environment, read [here](https://github.com/elastic/kibana/blob/main/dev_docs/getting_started/setting_up_a_development_env.mdx). Use branch `8.15.0` or some `8.x.x` branch.
2. In the Kibana root directory, run `cd plugins`
3. Clone this repository there: `git clone https://github.com/adiwajshing/json-content.git`
4. Switch to this plugin's directory: `cd json-content`
5. Setup the plugin: `yarn bootstrap`
6. Start the dev build: `yarn dev --watch` (watch is optional)
7. To build for production, run: `yarn build`