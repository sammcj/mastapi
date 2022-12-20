import * as fs from 'fs';
import { MastodonAPI } from 'mastodon-api';
import * as yargs from 'yargs';

// Parse command line arguments using yargs
const argv = yargs
  .option('subscribe', {
    type: 'string',
    demandOption: true,
    describe: 'URL or path to a JSON file containing the list to subscribe to',
  })
  .option('instance', {
    type: 'string',
    demandOption: true,
    describe: 'URL of the Mastodon instance',
  }).argv;

// Load the list from the given URL or path
async function loadList(urlOrPath) {
  try {
    // Try parsing the input as a URL
    const response = await fetch(urlOrPath);
    return await response.json();
  } catch (error) {
    // If parsing as a URL fails, try reading the input as a file path
    return JSON.parse(fs.readFileSync(urlOrPath, 'utf-8'));
  }
}

// Create a Mastodon API client and authenticate
const client = new MastodonAPI({
  baseURL: argv.instance,
  access_token: 'YOUR_ACCESS_TOKEN',
});

// Load the list to subscribe to
const list = await loadList(argv.subscribe);

// Check if you are already subscribed to the list
const subscribedLists = await client.get('lists/list');
const isSubscribed = subscribedLists.some((l) => l.title === list.title);

if (!isSubscribed) {
  // If not subscribed, create the list and subscribe to it
  console.log(`Creating a list called "${list.title}" that will follow the following:`);
  for (const account of list.accounts) {
    console.log(`- ${account.username}`);
  }
  for (const hashtag of list.hashtags) {
    console.log(`- #${hashtag}`);
  }
  await client.post('lists/create', {
    title: list.title,
    account_ids: list.accounts.map((a) => a.id),
    hashtag: list.hashtags,
  });
} else {
  // If subscribed, compare the accounts and hashtags in the list to your current subscription
  const currentList = subscribedLists.find((l) => l.title === list.title);
  const currentAccounts = new Set(currentList.account_ids);
  const currentHashtags = new Set(currentList.hashtags);
  let changes = false;

  for (const account of list.accounts) {
    if (!currentAccounts.has(account.id)) {
      changes = true;
      console.log(`Adding ${account.username} to list "${list.title}"`);
      currentAccounts.add(account.id);
    }
  }
  for (const hashtag of list.hashtags) {
    if (!currentHashtags.has(hashtag)) {
      changes = true;
      console.log(`Adding #${hashtag} to list "${list.title}"`);
      currentHashtags.add(hashtag);
    }
  }

  if (changes) {
    // If there are differences, update your subscription to the list
    await client.post('lists/update', {
      id: currentList.id,
      title: currentList.title,
      account_ids: Array.from(currentAccounts),
      hashtag: Array.from(currentHashtags),
    });
  } else {
    console.log(`No changes to list "${list.title}"`);
  }
}
