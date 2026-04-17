# Some fix

1. Format JSON only in DocView Tab.
2. Add Server Side for import from terraform like using elasticstack_kibana_data_view module.
field_formats id is __'json'__
3. Test it work in Kibana 9.3.0

![Only DocView Tab](/images/onlyDocView.png)


# JSON Content

A Kibana plugin to pretty print JSON strings in the Kibana Discover/Logs tab. This doesn't index the JSON content, it just pretty prints & highlights it in the console for easier reading.

Built for Kibana 8.15.0.

I built this plugin because neither did I want to index the JSON content nor did I want to copy the JSON content to a JSON linter to pretty print it. After hours of searching, I couldn't find any way to pretty print JSONs in the Discover/Logs that did this, so I built one myself. If I missed something obvious, feel free to reach out.

## Installation

The plugin archive is pushed to the `build` folder & committed to the repository (Too lazy to set up a CI/CD pipeline for this).

1. Install in Kibana via:
   ```bash
   bin/kibana-plugin install https://github.com/adiwajshing/kibana-json-content/raw/refs/heads/master/build/jsonContent-8.15.0.zip
   ```
2. If you're running on Kubernetes, you can use [this guide](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-custom-images.html).

## Usage

1. Open your Discover/Logs tab & select the field you'd like to print as JSON. This must be some string field. See this [guide](https://www.elastic.co/guide/en/kibana/8.15/managing-data-views.html#managing-fields)
2. Enable the "Set format", and select JSON:
   ![Set format](/images/set-format.png)
3. Click save & close the field editor.
4. Now, you can see the JSON content pretty printed in the console!

Before:
   ![Raw JSON](/images/raw-json.png)
After:
   ![Pretty printed JSON](/images/pretty-printed-json.png)

## Development

1. Setup the Kibana development environment, read [here](https://github.com/elastic/kibana/blob/main/dev_docs/getting_started/setting_up_a_development_env.mdx). Use branch `8.15.0` or some `8.x.x` branch.
2. In the Kibana root directory, run `cd plugins`
3. Clone this repository there: `git clone https://github.com/adiwajshing/json-content.git`
4. Switch to this plugin's directory: `cd json-content`
5. Setup the plugin: `yarn bootstrap`
6. Start the dev build: `yarn dev --watch` (watch is optional)
7. To build for production, run: `yarn build`