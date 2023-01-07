import moment from "moment";
import _ from 'lodash'

const GIBNEY_280 = 'Gibney (280 Broadway)';
const GIBNEY_890 = 'Gibney (890 Broadway)';
const AVAILABLE = "Available";
const LOGIN = {
  loginUrl: "https://gibney.force.com/s/login/?ec=302&startURL=%2Fs%2F",
  username: Cypress.env("GIBNEY_USERNAME"),
  password: Cypress.env("GIBNEY_PASSWORD"),
};
const SLOTS_ROOT = `dist`;

const getSlotsFolder = (name) => `${SLOTS_ROOT}/${name}`;
const saveSlots = ({ name, room, slots, date }) =>
  cy.writeFile(`${getSlotsFolder(name)}/${room}/${date.format("YYYY-MM-DD")}.json`, slots);
const cleanSlots = (name) => cy.exec(`rm -rf "${getSlotsFolder(name)}"`);
const makeBody = (parsedBody) => (placeName, date) => ({
  ...parsedBody,
  "j_id0:j_id6:j_id13": placeName,
  "j_id0:j_id6:j_id16": date.format("MM/DD/YYYY"),
});

describe("Gibney Dance Center", () => {
  it("has availability", () => {
    cy.task("setValue", { key: "request", value: null });
    cy.viewport("macbook-13");

    cy.log(`Cleaning slots folders`);
    cleanSlots(GIBNEY_280);
    cleanSlots(GIBNEY_890);

    cy.log("Page 1: Login");
    cy.visit(LOGIN.loginUrl);
    cy.get('[placeholder="Username"]').type(LOGIN.username);
    cy.get('[placeholder="Password"]').type(LOGIN.password);
    cy.contains("Log in").click();

    cy.log("Page 2: Two buttons. Choose non-profit");
    cy.contains("Non-Profit Dance Rehearsal Request Form")
      .parents("div.cVIPFormCommunityCard")
      .find("button")
      .click();

    cy.log("Page 3: Three questions");
    cy.wait(10000);
    cy.iframe().within(() => {
      // "Are you renting space for a non-profit or individual dance rehearsal?"
      cy.get("select").eq(0).select("Yes");
      // "Will you be holding a non-profit or for-profit photoshoot..."
      cy.get("select").eq(1).select("No");
      // "Are you inquiring about subsidized, non-profit rehearsal space..."
      cy.get("select").eq(2).select("No");
      cy.get('[aria-label="Navigate Sections"]').contains("Next").click();
    });

    cy.log("Page 4: Select studio and date");
    cy.wait(12500);
    cy.iframe().within(() => {
      cy.iframe().within(() => {
        const fromDate = moment().clone();
        const toDate = getLastDateOfAvailability(fromDate.clone());
        const daysBetween = toDate.diff(fromDate, "days");
        console.debug(
          `Checking availability from ${fromDate.format("YYYY-MM-DD")} to ${toDate.format(
            "YYYY-MM-DD"
          )} (${daysBetween} days)`
        );

        // Intercept the request for availability, so we can duplicate it each of the upcoming days,
        // to use fetch in order to avoid clicking through the calendar.
        cy.intercept("/GDSE_Calendar*", (req) => {
          const parsedBody = req.body
            .split("&")
            .map((param) => param.split("="))
            .reduce(
              (acc, [key, value]) => ({
                ...acc,
                [decodeURIComponent(key)]: decodeURIComponent(value),
              }),
              {}
            );
          console.log({ url: req.url, parsedBody });
          const value = {
            url: req.url,
            body: parsedBody,
          };
          delete value.body[""];
          console.log({ value });

          // Cypress won't let us execute tasks inside the intercept callback, so we use
          // the undocumented cy.now() function to execute the task immediately.
          cy.now("task", "setValue", { key: "request", value });
        });
        findSlots({
          name: GIBNEY_280,
          date: fromDate.clone(),
          selectValue: "280 Broadway (Lower Manhattan)",
        });
        for (let i = 0; i <= daysBetween; i++) {
          findSlots({
            name: GIBNEY_280,
            date: fromDate.clone(),
            selectValue: "280 Broadway (Lower Manhattan)",
          });
          findSlots({
            name: GIBNEY_890,
            date: fromDate.clone(),
            selectValue: "890 Broadway (Union Square)",
          });
          fromDate.add(1, "days");
        }
      });
    });
  });
});

/**
 * Calendar availability for non-profit dance rehearsals will open 2 weeks prior to the 1st of the following calendar month.
 * i.e. Halfway through this month, Gibney adds availability for the following month.
 * If before 2 weeks prior to the 1st of the next month, return the end of this month.
 * If after 2 weeks prior to the 1st of the next month, return the end of the next month.
 */
function getLastDateOfAvailability(fromDate) {
  const firstOfNextMonth = moment().add(1, "months").startOf("month");
  const twoWeeksPrior = moment().add(1, "months").startOf("month").subtract(2, "weeks");
  return fromDate.isBefore(twoWeeksPrior)
    ? fromDate.endOf("month")
    : firstOfNextMonth.endOf("month");
}

/**
 * This only works on Page 4.
 */
function findSlots(options) {
  cy.task("getValue", { key: "request" }).then((result) => {
    if (result) {
      findSlotsByFetching(result, options);
    } else {
      findSlotsByClicking(options);
    }
  });
}

function findSlotsByFetching(result, options) {
  console.log("findSlotsByFetching", { result, options });
  cy.request({
    method: "POST",
    url: result.url,
    body: makeBody(result.body)(options.selectValue, options.date),
    form: true,
  }).then((res) => {
    const { body } = res;
    const html = body.split("\n").slice(1).join("\n");
    cy.task('parseHtmlForSlots', { html, date: options.date }).then(allSlots => {
      console.log(`Found ${allSlots.length} slots for ${options.name} on ${options.date.format("YYYY-MM-DD")}`);
      if (allSlots.length > 0) {
        const byRoom = _.groupBy(allSlots, "room");
        _.forEach(byRoom, (slots, room) => {
          console.log(`Saving ${slots.length} slots for ${options.name} on ${options.date.format("YYYY-MM-DD")} in room ${room}`);
          saveSlots({ name: options.name, room, slots: slots.map(slot => _.omit(slot, 'room')), date: options.date });
        });
      }
    })
  });
}

function findSlotsByClicking({ selectValue, date, name }) {
  cy.log(`Checking availability for ${name} on ${date.format("YYYY-MM-DD")}`);
  cy.log(`Selecting ${selectValue} in dropdown`);
  cy.get("select").eq(0).select(selectValue);

  const dateFormatted = date.format("MM/DD/YYYY");
  cy.log(`Clearing and typing date ${dateFormatted}`);
  cy.get(".dateInput").clear().type(dateFormatted);

  const searchTimeout = 7500;
  cy.log(`Clicking search button. Waiting ${searchTimeout}ms for results`);
  cy.get('input[value="Search"]').click().wait(searchTimeout);
  // Request is intercepted here. ^

  cy.log(`Scanning table rows for rooms in ${name}`);
  cy.get(".calendar-table tbody tr").then(($tr) => {
    for (let i = 0; i < $tr.length; i++) {
      const studioRow = $tr.eq(i);
      console.debug("Found row", { studioRow, selectValue, date });
      const room = studioRow.find("td").eq(0).text();
      const slots = [];

      let startTime = 7;
      studioRow.find("td.tableAction").each(function () {
        const cell = Cypress.$(this);
        if (cell.css("display") !== "none") {
          const status = cell.text();
          const hours = Number(cell.attr("colspan")) / 2;
          if (status === AVAILABLE) {
            console.debug(
              `Found ${hours} hours of availability in ${room} starting at ${startTime} on ${date.format(
                "YYYY-MM-DD"
              )}`
            );
            const start = moment(date)
              .hour(startTime)
              .minute(0)
              .second(0)
              .millisecond(0)
              .toISOString();
            const end = moment(date)
              .hour(startTime + hours)
              .minute(0)
              .second(0)
              .millisecond(0)
              .toISOString();
            const slot = {
              start,
              end,
            };
            slots.push(slot);
          }
          startTime += hours;
        }
      });

      if (slots.length > 0) {
        saveSlots({ name, room, slots, date });
      }
    }
  });
}
