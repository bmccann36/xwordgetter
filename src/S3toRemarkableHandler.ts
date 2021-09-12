import { S3objCreatedEventDTO } from './model/S3objCreatedEventDTO';

import S3 from 'aws-sdk/clients/s3'
import { Remarkable } from 'remarkable-typescript';
import getUuid from 'uuid-by-string';
const s3 = new S3()

export { Handler }

const Handler = async (event: S3objCreatedEventDTO) => {

  // console.log('JSON.stringify(event) :>> ', JSON.stringify(event));

  console.log('bucket data: ', event.Records[0].s3);

  const bucketName = event.Records[0].s3.bucket.name;
  const objKey = event.Records[0].s3.object.key;
  console.log('objkey :>> ', objKey);

  var params = {
    Bucket: bucketName,
    Key: objKey
  };
  console.log('fetching new object from s3');
  const s3res = await s3.getObject(params).promise()

  const fileBuffer: Buffer = <Buffer>s3res.Body;


  const client = new Remarkable(
    { deviceToken: process.env.REMARKABLE_DEVICE_TOKEN }
  );
  await client.refreshToken();

  console.log('uploading fetched s3 file to remarkable');
  const pdfUploadedId = await client.uploadPDF(
    objKey,
    getUuid(objKey),
    fileBuffer,
    getUuid('crosswords'));

  console.log('pdfUploadedId :>> ', pdfUploadedId);

}