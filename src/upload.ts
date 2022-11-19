import generator from 'megalodon';
import readline from 'readline';

const instanceUrl: string = process.env.INSTANCE_URL || 'https://aus.social';
const access_token: string = process.env.MASTODON_ACCESS_TOKEN as string;
const client = generator('mastodon', instanceUrl, access_token);

function printUsage() {
  console.log('Usage: MASTODON_ACCESS_TOKEN=12345 node upload.js <json_file_path>');
}

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

async function getFilePath() {
  try {
    return new Promise((resolve, reject) => {
      rl.question('Enter file path: ', (answer: string) => {
        // call isValidJSON
        if (isValidJSON(answer)) {
          // return the JSON
          resolve(answer);
        }
        reject('Invalid JSON');
      });
    });
  } catch (error) {
    console.log(error);
  }
}

async function uploadFilters(filePath: string) {
  const filtersJSON = JSON.parse(JSON.stringify(filePath));
  const filters = filtersJSON.split(',');
  filters.forEach((filter: any) => {
    const phrase = filter.phrase;
    const context = filter.context;
    const whole_word = filter.whole_word;
    const expires_at = filter.expires_at;
    const irreversible = filter.irreversible;
    const options = {
      whole_word,
      expires_at,
      irreversible,
    };
    console.log(filters);
    client.createFilter(phrase, context, options);
  });
}

if (process.argv.length > 2) {
  const filePath = process.argv[2];
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`Use ${filePath}? (y/n) `, (answer: string) => {
    if (answer === 'y' || answer === 'Y') {
      try {
        console.log(uploadFilters(JSON.stringify(filePath)));
      } catch (error) {
        console.error(error);
      }
    } else {
      getFilePath().then((answer) => {
        try {
          uploadFilters(JSON.stringify(answer));
        } catch (error) {
          console.error(error);
        }
      });
    }
  });
} else {
  printUsage();
  getFilePath().then((answer) => {
    try {
      uploadFilters(JSON.stringify(answer));
    } catch (error) {
      console.error(error);
    }
  });
}
