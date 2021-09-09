
import cheerio from 'cheerio';
import { XWordApiQsModel } from './model/XWordApiQsModel';
import querystring from 'querystring';
const chromium = require('chrome-aws-lambda');
import S3 from 'aws-sdk/clients/s3'
import { Browser } from 'puppeteer';
const s3 = new S3()

export { Handler }

const PUZZLE_DATE_OVERRIDE = process.env.PUZZLE_DATE_OVERRIDE;

const Handler = async (event) => {

  const BASE_URL = 'https://www.newyorker.com/puzzles-and-games-dept/crossword/';

  let dateForUrl;
  if (PUZZLE_DATE_OVERRIDE) {
    console.warn('overriding puzzle date to: ', PUZZLE_DATE_OVERRIDE)
    dateForUrl = PUZZLE_DATE_OVERRIDE;
  } else {
    const todayDate = new Date()
    const dateWithDash = todayDate.toISOString().split('T')[0];
    dateForUrl = dateWithDash.split('-').join('/')
  }

  const fullUrl = BASE_URL + dateForUrl;
  console.log('will load URL ', fullUrl);

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });
  //* LOAD INTERACTIVE PUZZLE PAGE TO SCRAPE THE PUZZLE ID
  const puzId = await getPuzzleId(browser, fullUrl);
  console.log('puzzle Id :>> ', puzId);
  //* LOAD NEXT PAGE AND GET PDF AS BUFFER
  const pdfBuff = await getPdfBuffer(browser, puzId)

  //* UPLOAD TO S3
  const putRes = await s3.putObject({
    Bucket: 'puzzle-pdf-bucket',
    Key: `puzzle-${new Date().toISOString()}.pdf`,
    Body: pdfBuff
  }).promise()

  console.log('s3 put response ', putRes);

  // Close the browser - done! 
  await browser.close();

};

async function getPuzzleId(browser: Browser, fullUrl: string): Promise<string> {
  const page = await browser.newPage();
  await page.goto(fullUrl); //! this is where end of URL is set dynamically

  const headInnerHtml = await page.evaluate(() => document.head.innerHTML);
  const $ = cheerio.load(headInnerHtml);
  console.log('closing nyer interactive crossword page');
  await page.close();
  // select the tag
  const pageJsonData = $('script[type="application/ld+json"]')
  // parse the content as json
  const parsedPuzzleData: any = JSON.parse(pageJsonData.html());
  // i.e. [#crossword: https://cdn3.amuselabs.com/tny/crossword?id=e952fc80&set=tny-weekly&embed=1&compact=1&maxCols=2]
  const puzUrlStringRaw = parsedPuzzleData[0].articleBody;
  const urlOnly = puzUrlStringRaw
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace('[#crossword: ', '')
    .replace(']', '')
  const queryParamsOnly = urlOnly.split('?')[1];
  // parse the search params
  let params = new URLSearchParams(queryParamsOnly);
  return params.get("id");
}

async function getPdfBuffer(browser: Browser, puzId: string): Promise<Buffer> {
  const qryModel: XWordApiQsModel = getDefaultSearchParams();
  qryModel.id = puzId //! this is were ID is set
  const qs = querystring.stringify(qryModel);

  console.log('loading page with crossword PDF');

  const pdfPage = await browser.newPage();
  // Allows you to intercept a request; must appear before your first page.goto()
  await pdfPage.setRequestInterception(true);
  // Request intercept handler... will be triggered with  each page.goto() statement
  pdfPage.on('request', async (interceptedRequest) => {
    var data = {
      method: 'POST',
      postData: qs,
      headers: {
        ...interceptedRequest.headers(),
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    // Request modified... finish sending! 
    await interceptedRequest.continue(data);
    // Immediately disable setRequestInterception, or all other requests will hang
    await pdfPage.setRequestInterception(false);
  });

  // Navigate, trigger the intercept, and resolve the response
  await pdfPage.goto('https://cdn3.amuselabs.com/tny/crossword-pdf');

  await pdfPage.setViewport({ width: 1300, height: 1500 });

  const pdfBuff = await pdfPage.pdf({
    printBackground: true,
    // path: "webpage.pdf",
    format: "letter",
    margin: {
      top: "20px",
      bottom: "40px",
      left: "20px",
      right: "20px"
    }
  });
  await pdfPage.close();
  return pdfBuff;
}

function getDefaultSearchParams(): XWordApiQsModel {
  return {
    answers: "0",
    boxVal: "",
    checkPDF: "false",
    chessView: "0",
    clueFontSizeStep: "0",
    cluesAndAnswersText: "0",
    emptyBoxOpacity: "NaN",
    encodedBoxState: "",
    gridOnly: "0",
    hideClueColumns: "false",
    id: null,
    isPreview: "false",
    locale: "en-US",
    print: "1",
    printType: "print-puzzle",
    puzzleType: "crossword",
    rtlGrid: "false",
    rtlInterface: "false",
    set: "tny-weekly",
    theme: "tny"
  }
}



