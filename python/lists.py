import json
import argparse
import requests

# Parse command line arguments using argparse
parser = argparse.ArgumentParser()
parser.add_argument('--subscribe', required=True, help='URL or path to a JSON file containing the list to subscribe to')
args = parser.parse_args()

# Load the list from the given URL or path
def load_list(url_or_path: str):
  try:
    # Try parsing the input as a URL
    response = requests.get(url_or_path)
    return response.json()
  except requests.exceptions.RequestException:
    # If parsing as a URL fails, try reading the input as a file path
    with open(url_or_path, 'r') as f:
      return json.load(f)

# Authenticate with the Mastodon API
headers = {
  'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
}

# Load the list to subscribe to
list = load_list(args.subscribe)

# Check if you are already subscribed to the list
response = requests.get('https://mastodon.social/api/v1/lists/list', headers=headers)
response.raise_for_status()
subscribed_lists = response.json()
is_subscribed = any(l['title'] == list['title'] for l in subscribed_lists)

if not is_subscribed:
  # If not subscribed, create the list and subscribe to it
  print(f'Creating a list called "{list["title"]}" that will follow the following:')
  for account in list['accounts']:
    print(f'- {account["username"]}')
  for hashtag in list['hashtags']:
    print(f'- #{hashtag}')

  response = requests.post('https://mastodon.social/api/v1/lists/create', json={
    'title': list['title'],
    'account_ids': [account['id'] for account in list['accounts']],
    'hashtags': list['hashtags'],
  }, headers=headers)
  response.raise_for_status()
else:
  # If subscribed, compare the accounts and hashtags in the list to your current subscription
  current_list = next(l for l in subscribed_lists if l['title'] == list['title'])
  current_account_ids = set(current_list['account_ids'])
  current_hashtags = set(current_list['hashtags'])
  changes = False

  for account in list['accounts']:
    if account['id'] not in current_account_ids:
      changes = True
      print(f'Adding {account["username"]} to list "{list["title"]}"')
      current_account_ids.add(account['id'])
  for hashtag in list['hashtags']:
    if hashtag not in current_hashtags:
      changes = True
      print(f'Adding #{hashtag} to list "{list["title"]}"')
      current_hashtags.add(hashtag)
    if changes:
      # If there are differences, update your subscription to the list
      response = requests.post('https://mastodon.social/api/v1/lists/update', json={
        'id': current_list['id'],
        'title': current_list['title'],
        'account_ids': list(current_account_ids),
        'hashtags': list(current_hashtags),
        }, headers=headers)
    response.raise_for_status()
  else:
    print(f'Already subscribed to list "{list["title"]}" with the same accounts and hashtags')

# Example JSON:
# {
#   "title": "Funny Accounts",
#   "accounts": [
#     {
#       "id": 123,
#       "username": "funny_account_1"
#     },
#     {
#       "id": 456,
#       "username": "funny_account_2"
#     }
#   ],
#   "hashtags": [
#     "funny",
#     "humor"
#   ]
# }
