import { Request, Response } from "express";
import { validate } from "uuid";
import * as queueService from "./queueService";

export const sendMessage = (req: Request, res: Response) => {
  const { messageData } = req.body;
  if (!messageData) {
    res.status(400);
    return res.end("It is not possible to send a message with no data");
  }
  const messageId = queueService.createMessage(messageData);
  return res.end(messageId);
};

export const getMessage = (req: Request, res: Response) => {
  const message = queueService.getMessage();
  if (!message) {
    return res.end("There are no messages available for processing");
  }
  return res.json(message);
};

export const processMessage = (req: Request, res: Response) => {
  const { messageId } = req.body;
  if (!messageId || !validate(messageId)) {
    res.status(400);
    return res.end(
      "The massage id was not supplied or the id supplied is not valid"
    );
  }
  try {
    queueService.processMessage(messageId);
    res.end();
  } catch (error) {
    res.status(400);
    res.end(error.message);
  }
};
