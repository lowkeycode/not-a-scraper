const puppeteer = require("puppeteer");
const fs = require("fs");
const { log } = require("console");

const API_URL = "https://apim.canadiantire.ca/v1/search";
const INIT_URL = "https://www.canadiantire.ca/en/promotions/hot-sale.html";
let nextUrl = "";
let urlToSearch = "";
let products = {
  products: [],
};

let count = 0;

async function getData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on("response", (r) => {
    if (r.request().isNavigationRequest() && r.frame() === page.mainFrame())
      console.log(`== NAVIGATION COMMITTED TO ${r.url()} ==`);
  });

  urlToSearch = nextUrl ? `${INIT_URL}${nextUrl}` : INIT_URL

  page.on("requestfinished", async (req) => {
    try {
      const url = req.url();
      if (!url.includes(API_URL)) return;

      const response = req.response();
      console.log(`- fetching: ${API_URL}`);

      const data = await response.json();

      if (data.products?.length) {
        products.products = [...products.products, ...data.products];
      }

      if (data.pagination.nextUrl && count < 3) {
        count++;
        nextUrl = data.pagination.nextUrl;
        getData();
      } else {
        console.log(products)
        fs.writeFile("./data.json", JSON.stringify(products), (err) => {
          if (err) {
            console.error(err);
          }
          console.log("== FILE WRITTEN ==");
        });
      }
    } catch (e) {
      console.error(`- failed: ${e}`);
    }
  });

  setTimeout(async () => {
    await page.goto(urlToSearch, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
  }, 3000);
}

getData();

// const url = "https://www.canadiantire.ca/en/promotions/hot-sale.html";
// const wantedUrl = "https://apim.canadiantire.ca/v1/search";
