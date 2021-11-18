# aws-elasticsearch-connector

[![Build Status](https://travis-ci.org/compwright/aws-elasticsearch-connector.png?branch=master)](https://travis-ci.org/compwright/aws-elasticsearch-connector)
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
const { Client } = require('@elastic/elasticsearch')
const AWS = require('aws-sdk')
const createAwsElasticsearchConnector = require('aws-elasticsearch-connector')

// (Optional) load profile credentials from file
AWS.config.update({
  profile: 'my-profile'
})

const client = new Client({
  ...createAwsElasticsearchConnector(AWS.config),
  node: 'https://my-elasticsearch-cluster.us-east-1.es.amazonaws.com'
})
```

### Using specific configuration

```javascript
const { Client } = require('@elastic/elasticsearch')
const AWS = require('aws-sdk')
const createAwsElasticsearchConnector = require('aws-elasticsearch-connector')

const awsConfig = new AWS.Config({
  // Your credentials and settings here, see
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
})

const client = new Client({
  ...createAwsElasticsearchConnector(awsConfig),
  node: 'https://my-elasticsearch-cluster.us-east-1.es.amazonaws.com'
})
````

## Test

```bash
npm test

# Run integration tests against a real endpoint
AWS_PROFILE=your-profile npm run test:integration -- \
  --endpoint https://my-elasticsearch-cluster.us-east-1.es.amazonaws.com
```
