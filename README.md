# aws-opensearch-connector

[![Build Status](https://travis-ci.org/yosefbs/aws-opensearch-connector.png?branch=master)](https://travis-ci.org/yosefbs/aws-opensearch-connector)
[![Code Climate](https://codeclimate.com/github/yosefbs/aws-opensearch-connector/badges/gpa.svg)](https://codeclimate.com/github/yosefbs/aws-opensearch-connector)
[![Test Coverage](https://codeclimate.com/github/yosefbs/aws-opensearch-connector/badges/coverage.svg)](https://codeclimate.com/github/yosefbs/aws-opensearch-connector/coverage)
[![Download Status](https://img.shields.io/npm/dm/aws-opensearch-connector.svg?style=flat-square)](https://www.npmjs.com/package/aws-opensearch-connector)

A tiny [Amazon Signature Version 4](https://www.npmjs.com/package/aws4) connection class for the official [Opensearch Node.js client](https://www.npmjs.com/package/@opensearch-project/opensearch), for compatibility with AWS OpenSearch and IAM authentication.

Supports AWS SDK global or specific configuration instances (AWS.Config), including asyncronous credentials from IAM roles and credential refreshing.

## Example usage

### Using global configuration

```javascript
const { Client } = require('@opensearch-project/opensearch')
const AWS = require('aws-sdk')
const createAwsOpensearchConnector = require('aws-opensearch-connector')

// (Optional) load profile credentials from file
AWS.config.update({
  profile: 'my-profile'
})

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
````

## Test

```bash
npm test

# Run integration tests against a real endpoint
AWS_PROFILE=your-profile npm run test:integration -- \
  --endpoint https://my-opensearch-cluster.us-east-1.es.amazonaws.com
```
