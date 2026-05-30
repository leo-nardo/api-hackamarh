import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { FileConfig } from './file-config.type';

export const createS3Client = (config: FileConfig): S3Client => {
  const clientConfig: S3ClientConfig = {
    credentials: {
      accessKeyId: config.accessKeyId ?? '',
      secretAccessKey: config.secretAccessKey ?? '',
    },
    region: config.awsS3Region ?? 'auto',
  };

  if (config.awsS3Endpoint) {
    clientConfig.endpoint = config.awsS3Endpoint;
    clientConfig.forcePathStyle =
      config.awsS3ForcePathStyle ?? Boolean(config.awsS3Endpoint);
  }

  return new S3Client(clientConfig);
};
