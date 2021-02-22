const puppeteer = require('puppeteer');
const url = require('url');
const {exec} = require("child_process");

(async () => {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();
    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36');
    const data = {};
    const results = []; // collects all results

    let paused = false;
    let pausedRequests = [];

    const nextRequest = () => { // continue the next request or "unpause"
        if (pausedRequests.length === 0) {
            paused = false;
        } else {
            (pausedRequests.shift())(); // calls the request.continue function
        }
    };

    await page.setRequestInterception(true);
    page.on('request', request => {
        if (paused) {
            pausedRequests.push(() => request.continue());
        } else {
            paused = true; // pause, as we are processing a request now
            
            request.continue();
        }
    });

    page.on('requestfinished', async (request) => {
        if(request.url().match("googlevideo.com/videoplayback")  )
        {
            let u = request.url();
            const params= (new URL(u)).searchParams;
            u = u.replace(params.get("range"), "0-" + params.get("clen"));
            if(request.url().match("mime=video"))
                data["video"] = u;
            else if(request.url().match("mime=audio"))
                data["audio"] = u;
            console.log(u);
            
        }
        if (Object.keys(data).length == 2)
        {exec(`./down.sh "${data["video"]}"  "${data["audio"]}"`, (error, stdout, stderr) => {
                    console.log(`stdout: ${stdout}`);
                    process.exit();
                });

        }
            
        nextRequest(); // continue with next request
    });
    page.on('requestfailed', (request) => {
        nextRequest();
    });

    await page.goto(process.argv[2], { waitUntil: 'networkidle0' });

    await browser.close();
})();
