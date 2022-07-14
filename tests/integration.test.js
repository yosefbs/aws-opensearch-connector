'use strict';

const AWS = require('aws-sdk');
const { Client } = require('@opensearch-project/opensearch');
const argv = require('minimist')(process.argv.slice(2));
const createAwsOpensearchConnector = require('../src');

describe('test', function () {
  AWS.config.update({
    region: argv.region,
    profile: argv.profile,
  });
  console.log(JSON.stringify(argv));
  before(async function () {
    // runs before all tests in this file regardless where this line is defined.
    if (argv.role) {
      const roleToAssume = {
        RoleArn: argv.role,
        RoleSessionName: 'session1',
        DurationSeconds: 900,
      };
      // Create the STS service object
      const sts = new AWS.STS({ apiVersion: '2011-06-15' });
      // Assume Role
      const { Credentials } = await sts.assumeRole(roleToAssume).promise();
      AWS.config.update({
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken,
      });
    }
  });

  const client = new Client({
    ...createAwsOpensearchConnector(AWS.config),
    node: argv.endpoint,
  });

  client.on('response', (err, res) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Request:', res.meta.request);
      console.log('Response:', res.statusCode, res.body);
    }
  });

  describe('AWS Opensearch', function () {
    this.timeout(10000);
    this.slow(1000);

    it('should be able to connect', () => {
      return client.cluster.health();
    });

    it('can clearScroll()', () => {
      return client.search({ scroll: '10s' }).then((result) => {
        return client.clearScroll({
          body: {
            scroll_id: [result.body._scroll_id],
          },
        });
      });
    });

    it('handles unicode', () => {
      return client.search({
        index: '*',
        size: 0,
        body: {
          query: { query_string: { query: 'ü' } },
        },
      });
    });
  });
});
