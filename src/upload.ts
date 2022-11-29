import { MegalodonInterface } from 'megalodon';
import readline from 'readline';
export async function upload_filters(inputFilters: string, client: MegalodonInterface) {
  function isValidJSON(json: string) {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      console.error('Invalid JSON');
      process.exit(1);
    }
  }

  isValidJSON(inputFilters);

  async function uploadFilters(filePath: string) {
    const filtersJSON = JSON.parse(JSON.stringify(filePath));
    const filters = filtersJSON.split(',');
    console.log(
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
      }),
    );
  }

  // TODO: replace with prompt or the other way round
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    `Are you sure you want to restore files from ${inputFilters} ? (y/n)`,
    (answer: string) => {
      if (answer === 'y' || answer === 'Y') {
        try {
          console.log(uploadFilters(JSON.stringify(inputFilters)));
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('Aborting');
      }
      rl.close();
    },
  );
}
