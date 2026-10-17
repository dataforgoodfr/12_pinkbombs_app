import "@testing-library/jest-dom/extend-expect";

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

// Allow router mocks.
// eslint-disable-next-line no-undef
jest.mock("next/router", () => require("next-router-mock"));
