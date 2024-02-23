import { Connection, Transport } from '@opensearch-project/opensearch';
import AWS from 'aws-sdk';
import { AwsCredentialIdentity } from '@smithy/types';

export type Connector = {
  Connection: typeof Connection;
  Transport: typeof Transport;
};

export const ConnectorFactory: (
  awsConfig: AWS.Config | AwsCredentialIdentity
) => Connector;

export default ConnectorFactory;
