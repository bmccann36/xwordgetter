const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.newyorker.com/puzzles-and-games-dept/crossword/2021/09/03');



  const headInnerHtml = await page.evaluate(() => document.head.innerHTML);


  const $ = cheerio.load(headInnerHtml);
  // // select the tag
  const pageJsonData = $('script[type="application/ld+json"]')
  console.log(pageJsonData.html());
  // // parse the content as json

  // const parsedPuzzleData = JSON.parse(pageJsonData.html());
  // // i.e. [#crossword: https://cdn3.amuselabs.com/tny/crossword?id=e952fc80&set=tny-weekly&embed=1&compact=1&maxCols=2]
  // const puzUrlStringRaw = parsedPuzzleData[0].articleBody;
  // const urlOnly = puzUrlStringRaw
  //   .replace(/(\r\n|\n|\r)/gm, '')
  //   .replace('[#crossword: ', '')
  //   .replace(']', '')
  // const queryParamsOnly = urlOnly.split('?')[1];
  // // parse the search params
  // let params = new URLSearchParams(queryParamsOnly);
  // console.log(params.get("id"));

  await browser.close();
})();