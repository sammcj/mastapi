# MastAPI

A repo for playing around with the mastodon API

## Usage

```bash
npm install
npm run build
npm run start
```

## Contributing

## References

## Lists

lists.ts

This code does the following:

1. Parses the `--subscribe` command line argument using yargs.
2. Loads the list to subscribe to from the given URL or file path.
3. Creates a Mastodon API client and authenticates using an access token.
4. Retrieves the lists that you are currently subscribed to.
5. If you are not subscribed to the list, creates the list and subscribes to it. If you are subscribed to the list, compares the accounts and hashtags in the list to your current subscription and updates your subscription if there are any differences.

The JSON file or URL should contain a list object in the following format:

```json
{
  "title": "List Title",
  "accounts": [
    {
      "id": 123,
      "username": "example_account"
    },
    // ...
  ],
  "hashtags": [
    "example_hashtag",
    // ...
  ]
}
```
