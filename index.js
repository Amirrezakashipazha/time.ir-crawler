const express = require("express");
const app = express();
const port = 3001;

const crawler = require("./crawlers/crawler");
const { ROUTES } = require("./ROUTES");

app.use(express.static("public"));

// --------------- crawlers Routes ------------------
for (let index = 0; index < ROUTES.length; index++) {
    const route = ROUTES[index];

    app.get(route.route, async (_, res) => {
        crawler(route.crawler_url, route.crawler,_.params).then((data) => {
            res.send(route.response(data));
        });
    });
}
// --------------- --------------- ------------------

app.get("/", (req, res) => {
    const baseURL = req.get("host");

    res.send({
        message: "server is running",
        github: "https://github.com/Amir-Alipour/time.ir-crawler",
        routes: [
          
            {
                route: "/year",
                description: "the current year and it months with events",
                url: `https://${baseURL}/year`,
            },
           
        ],
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
