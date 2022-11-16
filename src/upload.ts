import generator from 'megalodon';
import fs from 'fs';
import readline from 'readline';

const instanceUrl: string = process.env.INSTANCE_URL || 'https://aus.social';
const access_token: string = process.env.MASTODON_ACCESS_TOKEN as string;
const client = generator('mastodon', instanceUrl, access_token);

// prompt the user for filter file to restore
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// check the file is valid JSON
function isValidJSON(json: string) {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
}

// prompt the user for the path to a JSON file and return the files contents as a JSON object
function promptForJSONFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    rl.question('Enter the path to the JSON file to restore: ', (answer) => {
      const json = fs.readFileSync(answer, 'utf8');
      if (isValidJSON(json)) {
        resolve(json);
      } else {
        reject('Invalid JSON file');
      }
    });
  });
}

async function uploadFilters(json: string) {
  const filterObj = JSON.parse(json);

  filterObj.forEach((filter: Entity.Filter) => {
    client.createFilter(filter.phrase, filter.context);
  });
}

function run() {
  promptForJSONFile().then((json) => {
    uploadFilters(json);
  });
}

run();
