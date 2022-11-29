import { MegalodonInterface } from 'megalodon';
const fs = require('fs');
const timestamp = new Date().toISOString().split('T')[0];

export async function backup_filters(backupDir: string, client: MegalodonInterface) {
  if (!fs.existsSync(backupDir)) {
    fs.mkdir(backupDir, { recursive: true }, (err: any) => {
      if (err) throw err;
    });
  }

  const filePath = `${backupDir}/filters-${timestamp}.json`;

  // Get the current filters
  async function filters() {
    const filters = await client.getFilters();
    return filters.data;
  }

  // Export the filters to JSON and YAML files
  function backupFilters() {
    console.log(
      filters().then((filterObj) => {
        const json = JSON.stringify(filterObj, null, 2);

        fs.writeFile(filePath, json, (err: any) => {
          if (err) {
            console.error(err);
            return;
          } else {
            console.log(`Filters saved to ${filePath}`);
          }
        });
      }),
    );
  }

  function run() {
    backupFilters();
  }

  run();
}
