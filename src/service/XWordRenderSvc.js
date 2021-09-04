"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const puppeteer = __importStar(require("puppeteer"));
const querystring = __importStar(require("querystring"));
exports.default = async () => {
    const todayDate = new Date();
    const BASE_URL = 'https://www.newyorker.com/puzzles-and-games-dept/crossword/';
    const dateWithDash = todayDate.toISOString().split('T')[0];
    const dateWithSlash = dateWithDash.split('-').join('/');
    const fullUrl = BASE_URL + dateWithSlash;
    console.log('will load URL ', fullUrl);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.goto(fullUrl); //! this is where end of URL is set dynamically
    await page.goto(BASE_URL + '2021/09/03');
    const headInnerHtml = await page.evaluate(() => document.head.innerHTML);
    const $ = cheerio_1.default.load(headInnerHtml);
    console.log('closing nyer interactive crossword page');
    await page.close();
    // select the tag
    const pageJsonData = $('script[type="application/ld+json"]');
    // parse the content as json
    const parsedPuzzleData = JSON.parse(pageJsonData.html());
    // i.e. [#crossword: https://cdn3.amuselabs.com/tny/crossword?id=e952fc80&set=tny-weekly&embed=1&compact=1&maxCols=2]
    const puzUrlStringRaw = parsedPuzzleData[0].articleBody;
    const urlOnly = puzUrlStringRaw
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace('[#crossword: ', '')
        .replace(']', '');
    const queryParamsOnly = urlOnly.split('?')[1];
    // parse the search params
    let params = new URLSearchParams(queryParamsOnly);
    const puzId = params.get("id");
    console.log('puzzle ID: ', puzId);
    //* LOAD NEXT PAGE
    const qryModel = getDefaultSearchParams();
    qryModel.id = puzId; //! this is were ID is set
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
    await pdfPage.pdf({
        printBackground: true,
        path: "webpage.pdf",
        format: "letter",
        margin: {
            top: "20px",
            bottom: "40px",
            left: "20px",
            right: "20px"
        }
    });
    await pdfPage.close();
    // Close the browser - done! 
    await browser.close();
};
function getDefaultSearchParams() {
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
    };
}
