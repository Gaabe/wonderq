import app from "../src/app";
import * as request from "supertest";
import { validate } from "uuid";
import * as storage from "../src/storage";

jest.useFakeTimers();

beforeEach(() => {
  cleanStorages();
});

describe("Integration tests for the service's 3 endpoints", () => {
  it("Should be able to send a message, get it, and then process it", async () => {
    const sendResponse = await request(app).post("/send-message").send({
      messageData: "test",
    });
    expect(sendResponse.status).toEqual(200);
    expect(validate(sendResponse.text)).toBeTruthy();
    const getResponse = await request(app).get("/get-message");
    expect(getResponse.body).toMatchObject(
      expect.objectContaining({
        id: sendResponse.text,
        data: "test",
      })
    );
    const processResponse = await request(app).post("/process-message").send({
      messageId: sendResponse.text,
    });
    expect(processResponse.status).toEqual(200);
    jest.advanceTimersToNextTimer();
  });
  it("Should fail to process a message after it timesout", async () => {
    const sendResponse = await request(app).post("/send-message").send({
      messageData: "test",
    });
    expect(sendResponse.status).toEqual(200);
    expect(validate(sendResponse.text)).toBeTruthy();
    const getResponse = await request(app).get("/get-message");
    expect(getResponse.body).toMatchObject(
      expect.objectContaining({
        id: sendResponse.text,
        data: "test",
      })
    );
    jest.advanceTimersToNextTimer();
    const processResponse = await request(app).post("/process-message").send({
      messageId: sendResponse.text,
    });
    expect(processResponse.status).toEqual(400);
  });
  it("Should fail to get a message twice", async () => {
    const sendResponse = await request(app).post("/send-message").send({
      messageData: "test",
    });
    expect(sendResponse.status).toEqual(200);
    expect(validate(sendResponse.text)).toBeTruthy();
    const getResponse = await request(app).get("/get-message");
    expect(getResponse.body).toMatchObject(
      expect.objectContaining({
        id: sendResponse.text,
        data: "test",
      })
    );
    const getResponse2 = await request(app).get("/get-message");
    expect(getResponse2.body).toMatchObject({});
    jest.advanceTimersToNextTimer();
  });
});

function cleanStorages() {
  storage.receivedMessages.splice(0, storage.receivedMessages.length);
  storage.messagesInProcess.splice(0, storage.messagesInProcess.length);
}
