import generator from 'megalodon';
import fs from 'fs';
const datestamp = new Date().toISOString().split('T')[0];

const outdir = `./output/${datestamp}`;
if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir);
}

const instanceUrl: string = process.env.INSTANCE_URL || 'https://aus.social';
const access_token: string = process.env.MASTODON_ACCESS_TOKEN as string;
const client = generator('mastodon', instanceUrl, access_token);

async function filters() {
  const filters = await client.getFilters();
  return filters.data;
}

// Export the filters to JSON and YAML files
function backupFilters() {
  filters().then((filterObj) => {
    const json = JSON.stringify(filterObj, null, 2);
    const yaml = require('yaml').stringify(filterObj);
    fs.writeFileSync(`${outdir}/filters.json`, json);
    fs.writeFileSync(`${outdir}/filters.yaml`, yaml);
  });
}

function run() {
  backupFilters();
}

run();
