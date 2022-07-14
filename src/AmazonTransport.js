const { Transport } = require('@opensearch-project/opensearch');

function awaitAwsCredentials(awsConfig) {
  return new Promise((resolve, reject) => {
    awsConfig.getCredentials((err) => {
      err ? reject(err) : resolve();
    });
  });
}

module.exports = (awsConfig) => {
  class AmazonTransport extends Transport {
    request(params, options = {}, callback = undefined) {
      // options is optional, so if it is omitted, options will be the callback
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      // check if getCredentials exists, if so this is an aws-sdk v2 global config object
      if (typeof awsConfig.getCredentials !== 'function') {
        if (typeof callback === 'undefined') {
          return super.request(params, options);
        } else {
          super.request(params, options, callback);
        }
      } else {
        // Promise support
        if (typeof callback === 'undefined') {
          return awaitAwsCredentials(awsConfig).then(() =>
            super.request(params, options)
          );
        }

        // Callback support
        awaitAwsCredentials(awsConfig)
          .then(() => super.request(params, options, callback))
          .catch(callback);
      }
    }
  }

  return AmazonTransport;
};
