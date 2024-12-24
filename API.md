# Self-developing API

This developer's guide explainse how to access Self-developing API using programmatic tools such as `curl` or programming languages.

## Authorization

TODO: use az1.ai domain.
Go to [https://selfdev.vuics.com/keys](https://selfdev.vuics.com/keys) and create an API Key.
Set the environment variables:
```bash
export SELFDEV_API_URL=https://api.selfdev.vuics.com/v1
export SELFDEV_API_KEY=<YOUR_KEY>
```

Exchange the API key for an access token.

```bash
curl --user $SELFDEV_API_KEY -H 'Content-Type: application/json' -d '{ "grant_type": "client_credentials" }' -X POST $SELFDEV_API_URL/oauth2/token

# Output:
# {"access_token":"<TOKEN>","token_type":"Bearer"}
export SELFDEV_TOKEN=<TOKEN>
```

## Usage

### Ask

```bash
curl -H 'Authorization: Bearer '$SELFDEV_TOKEN -H 'Content-Type: application/json' -X POST $SELFDEV_API_URL/ask/api -d '{ "prompt": "What is self-developing AI?" }'

# Output:
# {"result":"ok","reply":"TBS"}
```

