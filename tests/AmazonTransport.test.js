'use strict'

const assert = require('assert')
const { Transport } = require('@opensearch-project/opensearch')
const AWS = require('aws-sdk')

const awsConfig = new AWS.Config({
  accessKeyId: 'foo',
  secretAccessKey: 'bar',
  sessionToken: 'baz'
})

const AmazonTransport = require('../src/AmazonTransport')(awsConfig)

describe('AmazonTransport', function () {
  it('extends Transport', function () {
    assert(AmazonTransport.prototype instanceof Transport)
  })

  describe('.request()', function () {
    const transport = new AmazonTransport({
      connectionPool: {
        getConnection: () => null
      }
    })

    it('calls the callback if provided', function (done) {
      transport.request({}, {}, () => done())
    })

    it('returns a Promise if callback not provided', function (done) {
      transport.request({}, {}).catch(() => done())
    })

    it('accepts callback in place of options', function (done) {
      transport.request({}, () => done())
    })

    it('waits for AWSConfig.getCredentials()', function (done) {
      const mockAwsConfig = {
        credentials: {},
        getCredentials (next) {
          next({
            accessKeyId: 'foo',
            secretAccessKey: 'bar',
            sessionToken: 'baz'
          })
          done()
        }
      }
      const AmazonTransport = require('../src/AmazonTransport')(mockAwsConfig)
      const transport = new AmazonTransport({
        connectionPool: {
          getConnection: () => null
        }
      })
      transport.request({}, {}, () => {})
    })
  })
})
