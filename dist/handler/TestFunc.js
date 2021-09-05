"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const chromium = require('chrome-aws-lambda');
const Handler = async (event, context, callback) => {
    let result = null;
    let browser = null;
    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        let page = await browser.newPage();
        await page.goto(event.url || 'https://google.com');
        result = await page.title();
    }
    catch (error) {
        return callback(error);
    }
    finally {
        if (browser !== null) {
            await browser.close();
        }
    }
    return callback(null, result);
};
exports.Handler = Handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdEZ1bmMuanMiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXMiOlsiaGFuZGxlci9UZXN0RnVuYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUs5QyxNQUFNLE9BQU8sR0FBRyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRTtJQUNqRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDbEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBRW5CLElBQUk7UUFDRixPQUFPLEdBQUcsTUFBTSxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztZQUN4QyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7WUFDbkIsZUFBZSxFQUFFLFFBQVEsQ0FBQyxlQUFlO1lBQ3pDLGNBQWMsRUFBRSxNQUFNLFFBQVEsQ0FBQyxjQUFjO1lBQzdDLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtZQUMzQixpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRW5DLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLG9CQUFvQixDQUFDLENBQUM7UUFFbkQsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzdCO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4QjtZQUFTO1FBQ1IsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO1lBQ3BCLE1BQU0sT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3ZCO0tBQ0Y7SUFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDO0FBSU8sMEJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjaHJvbWl1bSA9IHJlcXVpcmUoJ2Nocm9tZS1hd3MtbGFtYmRhJyk7XG5cblxuXG5cbmNvbnN0IEhhbmRsZXIgPSBhc3luYyAoZXZlbnQsIGNvbnRleHQsIGNhbGxiYWNrKSA9PiB7XG4gIGxldCByZXN1bHQgPSBudWxsO1xuICBsZXQgYnJvd3NlciA9IG51bGw7XG5cbiAgdHJ5IHtcbiAgICBicm93c2VyID0gYXdhaXQgY2hyb21pdW0ucHVwcGV0ZWVyLmxhdW5jaCh7XG4gICAgICBhcmdzOiBjaHJvbWl1bS5hcmdzLFxuICAgICAgZGVmYXVsdFZpZXdwb3J0OiBjaHJvbWl1bS5kZWZhdWx0Vmlld3BvcnQsXG4gICAgICBleGVjdXRhYmxlUGF0aDogYXdhaXQgY2hyb21pdW0uZXhlY3V0YWJsZVBhdGgsXG4gICAgICBoZWFkbGVzczogY2hyb21pdW0uaGVhZGxlc3MsXG4gICAgICBpZ25vcmVIVFRQU0Vycm9yczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGxldCBwYWdlID0gYXdhaXQgYnJvd3Nlci5uZXdQYWdlKCk7XG5cbiAgICBhd2FpdCBwYWdlLmdvdG8oZXZlbnQudXJsIHx8ICdodHRwczovL2dvb2dsZS5jb20nKTtcblxuICAgIHJlc3VsdCA9IGF3YWl0IHBhZ2UudGl0bGUoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gY2FsbGJhY2soZXJyb3IpO1xuICB9IGZpbmFsbHkge1xuICAgIGlmIChicm93c2VyICE9PSBudWxsKSB7XG4gICAgICBhd2FpdCBicm93c2VyLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XG59O1xuXG5cblxuZXhwb3J0IHsgSGFuZGxlciB9Il19