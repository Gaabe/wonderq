import { v4 as uuid } from "uuid";
import * as storage from "./storage";

const MESSAGE_PROCESS_TIMEOUT = 10000;

export function createMessage(messageData: any) {
  const newMessage = {
    id: uuid(),
    data: messageData,
  };
  storage.receivedMessages.push(newMessage);
  return newMessage.id;
}

export function getMessage() {
  if (storage.receivedMessages.length === 0) {
    return;
  }
  const message = popMessageFromStorage(storage.receivedMessages, undefined, 0);
  message.processingStartedAt = new Date();
  storage.messagesInProcess.push(message);
  setTimeout(
    () => checkProcessingMessages(message.id),
    MESSAGE_PROCESS_TIMEOUT
  );
  return message;
}

export function processMessage(messageId: string) {
  try {
    popMessageFromStorage(storage.messagesInProcess, messageId);
  } catch {
    throw new Error(
      "The requested message is not available for processing, it was probably moved back to the queue due to processing timeout"
    );
  }
}

export function checkProcessingMessages(messageId: string) {
  const message = storage.messagesInProcess.find(
    (message) => (message.id = messageId)
  );
  if (message) {
    popMessageFromStorage(storage.messagesInProcess, messageId);
    storage.receivedMessages.push(message);
  }
}

export function popMessageFromStorage(
  storageToLook: storage.IMessage[],
  messageId?: string,
  index?: number
) {
  index =
    index ?? storageToLook.findIndex((message) => message.id === messageId);
  if (index === -1) {
    throw new Error("The message was not found in the specified storage");
  }
  const message = storageToLook[index];
  storageToLook.splice(index, 1);
  return message;
}
