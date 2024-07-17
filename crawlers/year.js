const cheerio = require("cheerio");
const qs = require('qs'); 
const axios = require('axios');

module.exports =async  function (html,params) {

    const url = 'https://www.time.ir/fa/eventyear-%D8%AA%D9%82%D9%88%DB%8C%D9%85-%D8%B3%D8%A7%D9%84%DB%8C%D8%A7%D9%86%D9%87';

    // Define the form data with the dynamic year
    const formData = {
        ctl00_rssmStyleSheet_TSSM: '',
        ctl00_rsmAll_TSM: '',
        __EVENTTARGET: '',
        __EVENTARGUMENT: '',
        __VIEWSTATE: 'miDHspTM4b4WriZ37XnOFH1JrZolpOk+UfYdEh7Rt9rYn32IThPbICypYhWJp+iQbmg1+FJvdue0uP+kcw08oZ1OnAhYc/V6iwHuMg5NGhD23dYf',
        'ctl00$cphTop$Sampa_Web_View_EventUI_EventYearCalendar10cphTop_3417$txtYear': params.year,
        'ctl00$cphTop$Sampa_Web_View_EventUI_EventYearCalendar10cphTop_3417$btnGo': 'برو به سال',
        __VIEWSTATEGENERATOR: '65E7F3AF'
    };


    try {
        const response = await axios.post(url, qs.stringify(formData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Origin': 'https://www.time.ir',
                'Pragma': 'no-cache',
                'Referer': 'https://www.time.ir/fa/eventyear-%D8%AA%D9%82%D9%88%DB%8C%D9%85-%D8%B3%D8%A7%D9%84%DB%8C%D8%A7%D9%86%D9%87',
                'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                'Sec-Ch-Ua-Mobile': '?1',
                'Sec-Ch-Ua-Platform': '"Android"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
                // Add necessary cookies if required
                'Cookie': 'ASP.NET_SessionId=o5dugisauv0pj1usbcjhn41p; __AntiXsrfToken=99b48d4b62964a018e8ca33f5ed9dae9; Province=8; City=95; night-mode=0'
            }
        });

        const html = response.data;

        // Log the response HTML to debug
        // console.log('Response HTML:', html);

        const $ = cheerio.load(html);

        let events = [];

        // Assuming the structure of the page remains the same after posting the form
        $(".panel.panel-body").each((i, data) => {
            let jalali = $(data).find(".dates").find(".jalali").text().split(" ");

            let month_title = $(data)
                .find(".eventsCurrentMonthWrapper")
                .find("span")
                .first()
                .text()
                .trim();
            let month_events = [];

            $(data)
                .find(".eventsCurrentMonthWrapper")
                .find("> ul")
                .find("li")
                .each((i, data) => {
                    let isHoliday = $(data).hasClass("eventHoliday");
                    let date = $(data).find("> span").first().text();
                    let event = $(data)
                        .clone()
                        .children()
                        .remove()
                        .end()
                        .text()
                        .trim();

                    month_events.push({
                        date,
                        event,
                        isHoliday,
                    });
                });

            events.push({
                month_name: jalali.at(0),
                year_name: jalali.at(-1),
                month_title,
                events: month_events,
            });
        });

        return events;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
 
};
