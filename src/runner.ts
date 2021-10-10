import path from 'path';

require('dotenv').config({ path: path.join(__dirname, '..', 'local.env') })
import { Handler } from '.';
import { Handler as s3toRemarkable } from './S3toRemarkableHandler'
import fs from 'fs';

//? docker image handler with puppeteer

Handler({ puzzleDateOverride: '2021/10/08' })

//? s3 reader function
// const objCreatedJson = fs.readFileSync(path.join(__dirname, '..', 'mocks/objCreated.json'))
// s3toRemarkable(JSON.parse(objCreatedJson.toString()))