import { getPlacesByParentPathByDepth } from "./places";

it("At depth 1, Brooklyn should be in the Universe's places list", () => {
  expect(getPlacesByParentPathByDepth()![1]!["Universe"]![0].name).toBe("Brooklyn");
});
