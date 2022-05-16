# aws-elasticsearch-connector

[![Build Status](https://travis-ci.org/compwright/aws-elasticsearch-connector.png?branch=master)](https://travis-ci.org/compwright/aws-elasticsearch-connector)
[![Code Climate](https://codeclimate.com/github/compwright/aws-elasticsearch-connector/badges/gpa.svg)](https://codeclimate.com/github/compwright/aws-elasticsearch-connector)
[![Test Coverage](https://codeclimate.com/github/compwright/aws-elasticsearch-connector/badges/coverage.svg)](https://codeclimate.com/github/compwright/aws-elasticsearch-connector/coverage)
[![Dependency Status](https://img.shields.io/david/compwright/aws-elasticsearch-connector.svg?style=flat-square)](https://david-dm.org/compwright/aws-elasticsearch-connector)
[![Download Status](https://img.shields.io/npm/dm/aws-elasticsearch-connector.svg?style=flat-square)](https://www.npmjs.com/package/aws-elasticsearch-connector)

A tiny [Amazon Signature Version 4](https://www.npmjs.com/package/aws4) connection class for the official [Elasticsearch Node.js client](https://www.npmjs.com/package/elasticsearch), for compatibility with AWS Elasticsearch and IAM authentication.

Supports AWS SDK global or specific configuration instances (AWS.Config), including asyncronous credentials from IAM roles and credential refreshing.

## Installation

```bash
npm install --save aws-elasticsearch-connector @elastic/elasticsearch aws-sdk
```

## Example usage

### Using global configuration

```javascript
const { Client } = require("@elastic/elasticsearch");
const AWS = require("aws-sdk");
const createAwsElasticsearchConnector = require("aws-elasticsearch-connector");

// (Optional) load profile credentials from file
AWS.config.update({
  profile: "my-profile",
});

const client = new Client({
  ...createAwsElasticsearchConnector(AWS.config),
  node: "https://my-elasticsearch-cluster.us-east-1.es.amazonaws.com",
});
```

### Using specific configuration

```javascript
const { Client } = require("@elastic/elasticsearch");
const AWS = require("aws-sdk");
const createAwsElasticsearchConnector = require("aws-elasticsearch-connector");

const awsConfig = new AWS.Config({
  // Your credentials and settings here, see
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
});

const client = new Client({
  ...createAwsElasticsearchConnector(awsConfig),
  node: "https://my-elasticsearch-cluster.us-east-1.es.amazonaws.com",
});
```

### Using aws-sdk v3

```javascript
const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts");
const { Client } = require("@elastic/elasticsearch");
const createAwsElasticsearchConnector = require("./src/index.js");

async function ping() {
  const creds = await assumeRole(
    "arn:aws:iam::0123456789012:role/Administrator",
    "us-east-1"
  );
  const client = new Client({
    ...createAwsElasticsearchConnector({
      region: "us-east-1",
      credentials: creds,
    }),
    node: "https://my-elasticsearch-cluster.us-east-1.es.amazonaws.com",
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
  --endpoint https://my-elasticsearch-cluster.us-east-1.es.amazonaws.com
```
