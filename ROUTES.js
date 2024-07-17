// =============== Crawlers ================
const getYear = require("./crawlers/year");
// =========================================

const URLs = {
    date: "/",
    month: "/",
    year: "/fa/eventyear-%D8%AA%D9%82%D9%88%DB%8C%D9%85-%D8%B3%D8%A7%D9%84%DB%8C%D8%A7%D9%86%D9%87",
    qoute: "/",
    books: "/fa/booklist-%d9%81%d9%87%d8%b1%d8%b3%d8%aa-%da%a9%d8%aa%d8%a7%d8%a8%d9%87%d8%a7%db%8c-%d9%85%d8%b9%d8%b1%d9%81%db%8c-%d8%b4%d8%af%d9%87-%d8%af%d8%b1-%d8%aa%d8%a7%db%8c%d9%85",
};

exports.ROUTES = [
    {
        route: "/year/:year",
        crawler: getYear,
        crawler_url: URLs.year,
        response: (data) => {
            return {
                current_year_iranian_events: data,
            };
        },
    },
];
