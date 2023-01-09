import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { setSlotFilter } from "./state/slotFilters";
import { setPlaceFilter } from "./state/filters/placeFilter";

const enablePlace = (id: string) => {
  setSlotFilter("place", setPlaceFilter(true)(id));
};

it("App renders", async () => {
  enablePlace("Universe>Brooklyn>Triskelion Arts>Lillian");

  render(<App />);

  expect(screen.queryByText("Invalid DateTime")).not.toBeInTheDocument();
});
