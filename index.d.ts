import { Connection, Transport } from '@opensearch-project/opensearch';
import AWS from 'aws-sdk';

export type Connector = {
  Connection: typeof Connection;
  Transport: typeof Transport;
};

export const ConnectorFactory: (awsConfig: AWS.Config) => Connector;

export default ConnectorFactory;
