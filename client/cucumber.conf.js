const { Before, BeforeAll, AfterAll, After, setDefaultTimeout, setWorldConstructor } = require("@cucumber/cucumber");
const { chromium } = require("playwright");

setDefaultTimeout(60000)

class CustomWorld {
  constructor({ browser }) {
    this.browser = browser;
    this.page = null;
  }

  async openUrl(url) {
    this.page = await this.browser.newPage();
    await this.page.goto(url);
  }
}

let browser;

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: true,
    slowMo: 1000,
  });
});

setWorldConstructor(function () {
  return new CustomWorld({ browser });
});

// close the browser
AfterAll(async function () {
   await browser.close();
});

// Create a new browser context and page per scenario
Before(async function () {
   this.context = await browser.newContext();
   this.page = await this.context.newPage();
});

// Cleanup after each scenario
After(async function () {
   await this.page.close();
   await this.context.close();
});