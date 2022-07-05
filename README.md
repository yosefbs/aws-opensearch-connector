# aws-opensearch-connector

[![Download Status](https://img.shields.io/npm/dm/aws-opensearch-connector.svg?style=flat-square)](https://www.npmjs.com/package/aws-opensearch-connector)

A tiny [Amazon Signature Version 4](https://www.npmjs.com/package/aws4) connection class for the official [Opensearch Node.js client](https://www.npmjs.com/package/@opensearch-project/opensearch), for compatibility with AWS OpenSearch and IAM authentication.

Supports AWS SDK global or specific configuration instances (AWS.Config), including asyncronous credentials from IAM roles and credential refreshing.

## Installation

```bash
npm install --save aws-opensearch-connector
```

## Example usage

### Using global configuration

```javascript
const { Client } = require('@opensearch-project/opensearch')
const AWS = require('aws-sdk')
const createAwsOpensearchConnector = require('aws-opensearch-connector')

// (Optional) load profile credentials from file
AWS.config.update({
  profile: "my-profile",
});

const client = new Client({
  ...createAwsOpensearchConnector(AWS.config),
  node: 'https://my-opensearch-cluster.us-east-1.es.amazonaws.com'
})
```

### Using specific configuration

```javascript
const { Client } = require('@opensearch-project/opensearch')
const AWS = require('aws-sdk')
const createAwsOpensearchConnector = require('aws-opensearch-connector')

const awsConfig = new AWS.Config({
  // Your credentials and settings here, see
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
})

const client = new Client({
  ...createAwsOpensearchConnector(awsConfig),
  node: 'https://my-opensearch-cluster.us-east-1.es.amazonaws.com'
})

```
### Using aws-sdk v3

```javascript
const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts");
const { Client } = require('@opensearch-project/opensearch')
const createAwsOpensearchConnector = require("./src/index.js");

async function ping() {
  const creds = await assumeRole(
    "arn:aws:iam::0123456789012:role/Administrator",
    "us-east-1"
  );
  const client = new Client({
    ...createAwsOpensearchConnector({
      region: "us-east-1",
      credentials: creds,
    }),
    node: "https://my-opensearch-cluster.us-east-1.es.amazonaws.com",
  });
  const response = await client.ping();
  console.log(`Got Response`, response);
}

async function assumeRole(roleArn, region) {
  const client = new STSClient({ region });
  const response = await client.send(
    new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: "aws-es-connection",
    })
  );
  return {
    accessKeyId: response.Credentials.AccessKeyId,
    secretAccessKey: response.Credentials.SecretAccessKey,
    sessionToken: response.Credentials.SessionToken,
  };
}
```

## Test

```bash
npm test

# Run integration tests against a real endpoint
AWS_PROFILE=your-profile npm run test:integration -- \
  --endpoint https://my-opensearch-cluster.us-east-1.es.amazonaws.com
```
