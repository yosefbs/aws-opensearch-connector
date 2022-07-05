module.exports = (awsConfig) => ({
  Connection: require("./AmazonConnection")(awsConfig),
  Transport: require("./AmazonTransport")(awsConfig),
});
