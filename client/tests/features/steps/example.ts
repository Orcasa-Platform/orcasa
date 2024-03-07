import { Given, When, Then } from '@cucumber/cucumber';

Given(`a user has navigated to the homepage`, async function () {
  // [Given] Sets up the initial state of the system.
  await this.page.goto('http://localhost:3000');
  await this.page.waitForLoadState('load');
});

When(`the user looks at the page`, () => {
  // [When] Describes the action or event that triggers the scenario.
});

Then(`the user should see the main nav menu`, async function () {
  // [Then] Describes the expected outcome or result of the scenario.
  await this.page.waitForSelector('nav');
});

Then(`the main menu should have a Geospatial Data link`, async function () {
  // [Then] Describes the expected outcome or result of the scenario.
  await this.page.waitForSelector('nav a[href="/geospatial-data"]');
});
