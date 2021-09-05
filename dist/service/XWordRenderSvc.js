"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const querystring_1 = __importDefault(require("querystring"));
const chromium = require('chrome-aws-lambda');
exports.default = async () => {
    const todayDate = new Date();
    const BASE_URL = 'https://www.newyorker.com/puzzles-and-games-dept/crossword/';
    const dateWithDash = todayDate.toISOString().split('T')[0];
    const dateWithSlash = dateWithDash.split('-').join('/');
    const fullUrl = BASE_URL + dateWithSlash;
    console.log('will load URL ', fullUrl);
    const browser = await chromium.puppeteer.launch();
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
    const qs = querystring_1.default.stringify(qryModel);
    console.log('loading page with crossword PDF');
    const pdfPage = await browser.newPage();
    // Allows you to intercept a request; must appear before your first page.goto()
    await pdfPage.setRequestInterception(true);
    // Request intercept handler... will be triggered with  each page.goto() statement
    pdfPage.on('request', async (interceptedRequest) => {
        var data = {
            method: 'POST',
            postData: qs,
            headers: Object.assign(Object.assign({}, interceptedRequest.headers()), { "Content-Type": "application/x-www-form-urlencoded" })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWFdvcmRSZW5kZXJTdmMuanMiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXMiOlsic2VydmljZS9YV29yZFJlbmRlclN2Yy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHNEQUE4QjtBQUM5Qiw4REFBc0M7QUFDdEMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFJOUMsa0JBQWUsS0FBSyxJQUFJLEVBQUU7SUFDeEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtJQUU1QixNQUFNLFFBQVEsR0FBRyw2REFBNkQsQ0FBQztJQUUvRSxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNELE1BQU0sYUFBYSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBRXZELE1BQU0sT0FBTyxHQUFHLFFBQVEsR0FBRyxhQUFhLENBQUM7SUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUV2QyxNQUFNLE9BQU8sR0FBRyxNQUFNLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDckMsNEVBQTRFO0lBQzVFLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLENBQUM7SUFFekMsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDekUsTUFBTSxDQUFDLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEMs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R0QsU0FBUyxzQkFBc0I7SUFDN0IsT0FBTztRQUNMLE9BQU8sRUFBRSxHQUFHO1FBQ1osTUFBTSxFQUFFLEVBQUU7UUFDVixRQUFRLEVBQUUsT0FBTztRQUNqQixTQUFTLEVBQUUsR0FBRztRQUNkLGdCQUFnQixFQUFFLEdBQUc7UUFDckIsbUJBQW1CLEVBQUUsR0FBRztRQUN4QixlQUFlLEVBQUUsS0FBSztRQUN0QixlQUFlLEVBQUUsRUFBRTtRQUNuQixRQUFRLEVBQUUsR0FBRztRQUNiLGVBQWUsRUFBRSxPQUFPO1FBQ3hCLEVBQUUsRUFBRSxJQUFJO1FBQ1IsU0FBUyxFQUFFLE9BQU87UUFDbEIsTUFBTSxFQUFFLE9BQU87UUFDZixLQUFLLEVBQUUsR0FBRztRQUNWLFNBQVMsRUFBRSxjQUFjO1FBQ3pCLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFlBQVksRUFBRSxPQUFPO1FBQ3JCLEdBQUcsRUFBRSxZQUFZO1FBQ2pCLEtBQUssRUFBRSxLQUFLO0tBQ2IsQ0FBQTtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBYV29yZEFwaVFzTW9kZWwgfSBmcm9tICcuLy4uL21vZGVsL1hXb3JkQXBpUXNNb2RlbCc7XG5pbXBvcnQgY2hlZXJpbyBmcm9tICdjaGVlcmlvJzsgXG5pbXBvcnQgcXVlcnlzdHJpbmcgZnJvbSAncXVlcnlzdHJpbmcnO1xuY29uc3QgY2hyb21pdW0gPSByZXF1aXJlKCdjaHJvbWUtYXdzLWxhbWJkYScpO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKCkgPT4ge1xuICBjb25zdCB0b2RheURhdGUgPSBuZXcgRGF0ZSgpXG5cbiAgY29uc3QgQkFTRV9VUkwgPSAnaHR0cHM6Ly93d3cubmV3eW9ya2VyLmNvbS9wdXp6bGVzLWFuZC1nYW1lcy1kZXB0L2Nyb3Nzd29yZC8nO1xuXG4gIGNvbnN0IGRhdGVXaXRoRGFzaCA9IHRvZGF5RGF0ZS50b0lTT1N0cmluZygpLnNwbGl0KCdUJylbMF07XG4gIGNvbnN0IGRhdGVXaXRoU2xhc2ggPSBkYXRlV2l0aERhc2guc3BsaXQoJy0nKS5qb2luKCcvJylcblxuICBjb25zdCBmdWxsVXJsID0gQkFTRV9VUkwgKyBkYXRlV2l0aFNsYXNoO1xuICBjb25zb2xlLmxvZygnd2lsbCBsb2FkIFVSTCAnLCBmdWxsVXJsKTtcblxuICBjb25zdCBicm93c2VyID0gYXdhaXQgY2hyb21pdW0ucHVwcGV0ZWVyLmxhdW5jaCgpO1xuICBjb25zdCBwYWdlID0gYXdhaXQgYnJvd3Nlci5uZXdQYWdlKCk7XG4gIC8vIGF3YWl0IHBhZ2UuZ290byhmdWxsVXJsKTsgLy8hIHRoaXMgaXMgd2hlcmUgZW5kIG9mIFVSTCBpcyBzZXQgZHluYW1pY2FsbHlcbiAgYXdhaXQgcGFnZS5nb3RvKEJBU0VfVVJMICsgJzIwMjEvMDkvMDMnKTtcblxuICBjb25zdCBoZWFkSW5uZXJIdG1sID0gYXdhaXQgcGFnZS5ldmFsdWF0ZSgoKSA9PiBkb2N1bWVudC5oZWFkLmlubmVySFRNTCk7XG4gIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQoaGVhZElubmVySHRtbCk7XG4gIGNvbnNvbGUubG9nKCdjbG9zaW5nIG55ZXIgaW50ZXJhY3RpdmUgY3Jvc3N3b3JkIHBhZ2UnKTtcbiAgYXdhaXQgcGFnZS5jbG9zZSgpO1xuICAvLyBzZWxlY3QgdGhlIHRhZ1xuICBjb25zdCBwYWdlSnNvbkRhdGEgPSAkKCdzY3JpcHRbdHlwZT1cImFwcGxpY2F0aW9uL2xkK2pzb25cIl0nKVxuICAvLyBwYXJzZSB0aGUgY29udGVudCBhcyBqc29uXG4gIGNvbnN0IHBhcnNlZFB1enpsZURhdGE6IGFueSA9IEpTT04ucGFyc2UocGFnZUpzb25EYXRhLmh0bWwoKSk7XG4gIC8vIGkuZS4gWyNjcm9zc3dvcmQ6IGh0dHBzOi8vY2RuMy5hbXVzZWxhYnMuY29tL3RueS9jcm9zc3dvcmQ/aWQ9ZTk1MmZjODAmc2V0PXRueS13ZWVrbHkmZW1iZWQ9MSZjb21wYWN0PTEmbWF4Q29scz0yXVxuICBjb25zdCBwdXpVcmxTdHJpbmdSYXcgPSBwYXJzZWRQdXp6bGVEYXRhWzBdLmFydGljbGVCb2R5O1xuICBjb25zdCB1cmxPbmx5ID0gcHV6VXJsU3RyaW5nUmF3XG4gICAgLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZ20sICcnKVxuICAgIC5yZXBsYWNlKCdbI2Nyb3Nzd29yZDogJywgJycpXG4gICAgLnJlcGxhY2UoJ10nLCAnJylcbiAgY29uc3QgcXVlcnlQYXJhbXNPbmx5ID0gdXJsT25seS5zcGxpdCgnPycpWzFdO1xuICAvLyBwYXJzZSB0aGUgc2VhcmNoIHBhcmFtc1xuICBsZXQgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhxdWVyeVBhcmFtc09ubHkpO1xuICBjb25zdCBwdXpJZCA9IHBhcmFtcy5nZXQoXCJpZFwiKTtcbiAgY29uc29sZS5sb2coJ3B1enpsZSBJRDogJywgcHV6SWQpO1xuXG4gIC8vKiBMT0FEIE5FWFQgUEFHRVxuXG4gIGNvbnN0IHFyeU1vZGVsOiBYV29yZEFwaVFzTW9kZWwgPSBnZXREZWZhdWx0U2VhcmNoUGFyYW1zKCk7XG4gIHFyeU1vZGVsLmlkID0gcHV6SWQgLy8hIHRoaXMgaXMgd2VyZSBJRCBpcyBzZXRcbiAgY29uc3QgcXMgPSBxdWVyeXN0cmluZy5zdHJpbmdpZnkocXJ5TW9kZWwpO1xuXG4gIGNvbnNvbGUubG9nKCdsb2FkaW5nIHBhZ2Ugd2l0aCBjcm9zc3dvcmQgUERGJyk7XG5cbiAgY29uc3QgcGRmUGFnZSA9IGF3YWl0IGJyb3dzZXIubmV3UGFnZSgpO1xuICAvLyBBbGxvd3MgeW91IHRvIGludGVyY2VwdCBhIHJlcXVlc3Q7IG11c3QgYXBwZWFyIGJlZm9yZSB5b3VyIGZpcnN0IHBhZ2UuZ290bygpXG4gIGF3YWl0IHBkZlBhZ2Uuc2V0UmVxdWVzdEludGVyY2VwdGlvbih0cnVlKTtcbiAgLy8gUmVxdWVzdCBpbnRlcmNlcHQgaGFuZGxlci4uLiB3aWxsIGJlIHRyaWdnZXJlZCB3aXRoICBlYWNoIHBhZ2UuZ290bygpIHN0YXRlbWVudFxuICBwZGZQYWdlLm9uKCdyZXF1ZXN0JywgYXN5bmMgKGludGVyY2VwdGVkUmVxdWVzdCkgPT4ge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBwb3N0RGF0YTogcXMsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIC4uLmludGVyY2VwdGVkUmVxdWVzdC5oZWFkZXJzKCksXG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCJcbiAgICAgIH1cbiAgICB9O1xuICAgIC8vIFJlcXVlc3QgbW9kaWZpZWQuLi4gZmluaXNoIHNlbmRpbmchIFxuICAgIGF3YWl0IGludGVyY2VwdGVkUmVxdWVzdC5jb250aW51ZShkYXRhKTtcbiAgICAvLyBJbW1lZGlhdGVseSBkaXNhYmxlIHNldFJlcXVlc3RJbnRlcmNlcHRpb24sIG9yIGFsbCBvdGhlciByZXF1ZXN0cyB3aWxsIGhhbmdcbiAgICBhd2FpdCBwZGZQYWdlLnNldFJlcXVlc3RJbnRlcmNlcHRpb24oZmFsc2UpO1xuICB9KTtcblxuICAvLyBOYXZpZ2F0ZSwgdHJpZ2dlciB0aGUgaW50ZXJjZXB0LCBhbmQgcmVzb2x2ZSB0aGUgcmVzcG9uc2VcbiAgYXdhaXQgcGRmUGFnZS5nb3RvKCdodHRwczovL2NkbjMuYW11c2VsYWJzLmNvbS90bnkvY3Jvc3N3b3JkLXBkZicpO1xuXG4gIGF3YWl0IHBkZlBhZ2Uuc2V0Vmlld3BvcnQoeyB3aWR0aDogMTMwMCwgaGVpZ2h0OiAxNTAwIH0pO1xuXG4gIGF3YWl0IHBkZlBhZ2UucGRmKHtcbiAgICBwcmludEJhY2tncm91bmQ6IHRydWUsXG4gICAgcGF0aDogXCJ3ZWJwYWdlLnBkZlwiLFxuICAgIGZvcm1hdDogXCJsZXR0ZXJcIixcbiAgICBtYXJnaW46IHtcbiAgICAgIHRvcDogXCIyMHB4XCIsXG4gICAgICBib3R0b206IFwiNDBweFwiLFxuICAgICAgbGVmdDogXCIyMHB4XCIsXG4gICAgICByaWdodDogXCIyMHB4XCJcbiAgICB9XG4gIH0pO1xuICBhd2FpdCBwZGZQYWdlLmNsb3NlKCk7XG5cbiAgLy8gQ2xvc2UgdGhlIGJyb3dzZXIgLSBkb25lISBcbiAgYXdhaXQgYnJvd3Nlci5jbG9zZSgpO1xufVxuXG5cbmZ1bmN0aW9uIGdldERlZmF1bHRTZWFyY2hQYXJhbXMoKTogWFdvcmRBcGlRc01vZGVsIHtcbiAgcmV0dXJuIHtcbiAgICBhbnN3ZXJzOiBcIjBcIixcbiAgICBib3hWYWw6IFwiXCIsXG4gICAgY2hlY2tQREY6IFwiZmFsc2VcIixcbiAgICBjaGVzc1ZpZXc6IFwiMFwiLFxuICAgIGNsdWVGb250U2l6ZVN0ZXA6IFwiMFwiLFxuICAgIGNsdWVzQW5kQW5zd2Vyc1RleHQ6IFwiMFwiLFxuICAgIGVtcHR5Qm94T3BhY2l0eTogXCJOYU5cIixcbiAgICBlbmNvZGVkQm94U3RhdGU6IFwiXCIsXG4gICAgZ3JpZE9ubHk6IFwiMFwiLFxuICAgIGhpZGVDbHVlQ29sdW1uczogXCJmYWxzZVwiLFxuICAgIGlkOiBudWxsLFxuICAgIGlzUHJldmlldzogXCJmYWxzZVwiLFxuICAgIGxvY2FsZTogXCJlbi1VU1wiLFxuICAgIHByaW50OiBcIjFcIixcbiAgICBwcmludFR5cGU6IFwicHJpbnQtcHV6emxlXCIsXG4gICAgcHV6emxlVHlwZTogXCJjcm9zc3dvcmRcIixcbiAgICBydGxHcmlkOiBcImZhbHNlXCIsXG4gICAgcnRsSW50ZXJmYWNlOiBcImZhbHNlXCIsXG4gICAgc2V0OiBcInRueS13ZWVrbHlcIixcbiAgICB0aGVtZTogXCJ0bnlcIlxuICB9XG59XG4iXX0=