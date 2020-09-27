import { popMessageFromStorage } from "../src/queueService";

describe("Unit tests", () => {
  test("Check if the correct message if popped from the storage when passing message id", () => {
    const testStorage = [
      { id: "1", data: "test" },
      { id: "2", data: "test2" },
      { id: "3", data: "test3" },
    ];
    const message = popMessageFromStorage(testStorage, "2");
    expect(message).toMatchObject({ id: "2", data: "test2" });
  });
  test("Check if the correct message if popped from the storage when passing index", () => {
    const testStorage = [
      { id: "1", data: "test" },
      { id: "2", data: "test2" },
      { id: "3", data: "test3" },
    ];
    const message = popMessageFromStorage(testStorage, undefined, 2);
    expect(message).toMatchObject({ id: "3", data: "test3" });
  });
});
