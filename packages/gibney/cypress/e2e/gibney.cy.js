import moment from "moment";
import _ from "lodash";

const GIBNEY_280 = "Gibney (280 Broadway)";
const GIBNEY_890 = "Gibney (890 Broadway)";
const LOGIN = {
  loginUrl: "https://gibney.force.com/s/login/?ec=302&startURL=%2Fs%2F",
  username: Cypress.env("GIBNEY_USERNAME"),
  password: Cypress.env("GIBNEY_PASSWORD"),
};
const SLOTS_ROOT = `dist`;

const getSlotsFolder = (name) => `${SLOTS_ROOT}/${name}`;
const saveSlots = ({ name, room, slots, date }) =>
  cy.writeFile(
    `${getSlotsFolder(name)}/${room}/${date.format("YYYY-MM-DD")}.json`,
    slots
  );
const cleanSlots = (name) => cy.exec(`rm -rf "${getSlotsFolder(name)}"`);

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
      .find("button")
      .click();

    cy.log("Page 3: Three questions");
    const selectValueByText = (i, text) =>
      cy
        .get("flowruntime-flow")
        .find("lightning-select")
        .eq(i)
        .then(($el) => {
          const el = $el[0];
          const select = el.shadowRoot.querySelector("select");
          const options = Array.from(select.options);
          const option = options.find((option) => option.text === text);
          option.selected = true;
        });
    selectValueByText(0, "Yes");
    selectValueByText(1, "No");
    selectValueByText(2, "No");
    cy.intercept(
      // "/s/sfsites/aura?r=5&aura.FlowRuntimeConnect.navigateFlow=1",
      "/s/sfsites/aura*",
      (req) => {
        if (
          req.body &&
          req.body.indexOf("renting_space.Default%20Choice.selected") !== -1
        ) {
          req.body = req.body.replace(
            "renting_space.Default%20Choice.selected",
            "renting_space.RentingforNonprofitorindividual.Yes.selected"
          );
          req.body = req.body.replace(
            "holding_a_non_profit_or_for_profit.Default%20Choice.selected",
            "holding_a_non_profit_or_for_profit.No.selected"
          );
          req.body = req.body.replace(
            "inquiring_about_subsidized.Default%20Choice.selected",
            "inquiring_about_subsidized.SubsidizedYesorNo.No.selected"
          );
          req.continue();
          return;
        }

        if (
          req.body &&
          req.body.indexOf("GDSE_LWCExternalCalendarController") !== -1 &&
          req.body.indexOf("getStudios") !== -1
        ) {
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
          const value = {
            url: req.url,
            body: parsedBody,
          };
          delete value.body[""];
          console.log("Saving request", value);

          // Cypress won't let us execute tasks inside the intercept callback, so we use
          // the undocumented cy.now() function to execute the task immediately.
          cy.now("task", "setValue", { key: "request", value });
        }
      }
    );
    cy.wait(1000);
    cy.get("flowruntime-flow")
      .find("lightning-button")
      .then(($el) => {
        const el = $el[1];
        console.log("lightning-button", el);
        el.shadowRoot.querySelector("button").click();
      });

    cy.log("Page 4: Select studio and date");
    const fromDate = moment().clone();
    const toDate = getLastDateOfAvailability(fromDate.clone());
    const daysBetween = toDate.diff(fromDate, "days");
    console.debug(
      `Checking availability from ${fromDate.format(
        "YYYY-MM-DD"
      )} to ${toDate.format("YYYY-MM-DD")} (${daysBetween} days)`
    );

    findSlotsByClicking({
      name: GIBNEY_280,
      selectedDate: fromDate.clone(),
      selectValue: "280 Broadway (Lower Manhattan)",
    });
    cy.wait(2500);
    for (let i = 0; i <= daysBetween; i++) {
      findSlotsByFetching({
        name: GIBNEY_280,
        selectedDate: fromDate.clone(),
        selectedLocation: "280 Broadway (Lower Manhattan)",
      });
      findSlotsByFetching({
        name: GIBNEY_890,
        selectedDate: fromDate.clone(),
        selectedLocation: "890 Broadway (Union Square)",
      });
      fromDate.add(1, "days");
    }
  });
});

function findSlotsByFetching(options) {
  console.log("findSlotsByFetching", options);
  cy.task("getValue", { key: "request" }).then((request) => {
    const message = JSON.parse(request.body.message);
    message.actions[0].params.params.selectedDate =
      options.selectedDate.toISOString();
    message.actions[0].params.params.selectedLocation =
      options.selectedLocation;
    request.body.message = JSON.stringify(message);
    cy.request({
      method: "POST",
      url: request.url,
      body: request.body,
      form: true,
    }).then((res) => {
      const { body } = res;
      console.log("body", body);
      for (const studio of body.actions[0].returnValue.returnValue) {
        const blocks = studio.Blocked_Times__r;
        if (blocks) {
          const available = blocks.filter(
            (block) => block.Status__c === "Available"
          );
          const slots = available.map((block) => ({
            start: block.Start_Time__c,
            end: block.End_Time__c,
          }));
          const payload = {
            name: options.name,
            room: studio.Name,
            slots,
            date: options.selectedDate,
          };
          console.log("payload", payload);
          saveSlots(payload);
        }
      }
    });
  });
}

function findSlotsByClicking({ selectedLocation, selectedDate, name }) {
  cy.log(
    `Checking availability for ${name} on ${selectedDate.format("YYYY-MM-DD")}`
  );
  cy.log(`Selecting ${selectedLocation} in dropdown`);
  cy.get("flowruntime-flow").find("lightning-combobox").click();
  cy.get("flowruntime-flow").find("lightning-base-combobox-item").eq(0).click();
  cy.get("flowruntime-flow").find("lightning-button").eq(1).click();
}

/**
 * Calendar availability for non-profit dance rehearsals will open 2 weeks prior to the 1st of the following calendar month.
 * i.e. Halfway through this month, Gibney adds availability for the following month.
 * If before 2 weeks prior to the 1st of the next month, return the end of this month.
 * If after 2 weeks prior to the 1st of the next month, return the end of the next month.
 */
function getLastDateOfAvailability(fromDate) {
  const firstOfNextMonth = moment().add(1, "months").startOf("month");
  const twoWeeksPrior = moment()
    .add(1, "months")
    .startOf("month")
    .subtract(2, "weeks");
  return fromDate.isBefore(twoWeeksPrior)
    ? fromDate.endOf("month")
    : firstOfNextMonth.endOf("month");
}
