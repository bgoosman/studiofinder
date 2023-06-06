import moment from "moment";
import _ from "lodash";

const GIBNEY_280 = "Gibney (280 Broadway)";
const GIBNEY_890 = "Gibney (890 Broadway)";
const AVAILABLE = "Available";
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
    // cy.intercept("/s/sfsites/aura*", (req) => {
    //   const parsedBody = req.body
    //     .split("&")
    //     .map((param) => param.split("="))
    //     .reduce(
    //       (acc, [key, value]) => ({
    //         ...acc,
    //         [decodeURIComponent(key)]: decodeURIComponent(value),
    //       }),
    //       {}
    //     );
    //   cy.now("task", "setValue", {
    //     key: "aura.token",
    //     value: parsedBody["aura.token"],
    //   });
    // });
    cy.log("Page 2: Two buttons. Choose non-profit");
    cy.contains("Non-Profit Dance Rehearsal Request Form")
      .find("button")
      .click();
    // cy.wait(5000);
    // cy.task("getValue", { key: "aura.token" }).then((auraToken) => {
    //   console.log("aura.token", auraToken);
    //   cy.request({
    //     method: "POST",
    //     url: "https://gibney.my.site.com/s/sfsites/aura?r=5&aura.FlowRuntimeConnect.navigateFlow=1",
    //     body: {
    //       message: `{"actions":[{"id":"169;a","descriptor":"aura://FlowRuntimeConnectController/ACTION$navigateFlow","callingDescriptor":"UNKNOWN","params":{"request":{"action":"NEXT","serializedState":"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","fields":[{"field":"renting_space.RentingforNonprofitorindividual.Yes.selected","value":true,"isVisible":true},{"field":"holding_a_non_profit_or_for_profit.No.selected","value":true,"isVisible":true},{"field":"inquiring_about_subsidized.SubsidizedYesorNo.No.selected","value":true,"isVisible":true}],"uiElementVisited":true,"enableTrace":false,"lcErrors":{}}}}]}`,
    //       "aura.context": `{"mode":"PROD","fwuid":"wyQWsVjjDIx-Xsqekbsbwg","app":"siteforce:communityApp","loaded":{"APPLICATION@markup://siteforce:communityApp":"k6JknytX-C_r-3PiqoI3OQ","COMPONENT@markup://flowruntime:flowRuntimeForFlexiPage":"ll8_-xHDt0xb1fUkMNIMoQ","COMPONENT@markup://instrumentation:o11ySecondaryLoader":"NAR59T88qTprOlgZG3yLoQ"},"dn":[],"globals":{},"uad":false}`,
    //       "aura.pageURI": "/s/flow/Create_a_Non_Profit",
    //       "aura.token": auraToken,
    //     },
    //     form: true,
    //   }).then((res) => {
    //     const { body } = res;
    //     console.log("body", body);
    //   });
    //   cy.request({
    //     method: "POST",
    //     url: "https://gibney.my.site.com/s/sfsites/aura?r=8&aura.ApexAction.execute=1",
    //     body: {
    //       message: `{"actions":[{"id":"170;a","descriptor":"aura://FlowRuntimeConnectController/ACTION$navigateFlow","callingDescriptor":"UNKNOWN","params":{"request":{"action":"NEXT","serializedState":"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","fields":[{"field":"renting_space.RentingforNonprofitorindividual.Yes.selected","value":true,"isVisible":true},{"field":"holding_a_non_profit_or_for_profit.No.selected","value":true,"isVisible":true},{"field":"inquiring_about_subsidized.SubsidizedYesorNo.No.selected","value":true,"isVisible":true}],"uiElementVisited":true,"enableTrace":false,"lcErrors":{}}}}]}`,
    //       "aura.context": `{"mode":"PROD","fwuid":"wyQWsVjjDIx-Xsqekbsbwg","app":"siteforce:communityApp","loaded":{"APPLICATION@markup://siteforce:communityApp":"k6JknytX-C_r-3PiqoI3OQ","COMPONENT@markup://flowruntime:flowRuntimeForFlexiPage":"ll8_-xHDt0xb1fUkMNIMoQ","COMPONENT@markup://instrumentation:o11ySecondaryLoader":"NAR59T88qTprOlgZG3yLoQ"},"dn":[],"globals":{},"uad":false}`,
    //       "aura.pageURI": "/s/flow/Create_a_Non_Profit",
    //       "aura.token": auraToken,
    //     },
    //     form: true,
    //   }).then((res) => {
    //     const { body } = res;
    //     console.log("body", body);
    //   });
    // });

    cy.log("Page 3: Three questions");
    // "Are you renting space for a non-profit or individual dance rehearsal?"
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
