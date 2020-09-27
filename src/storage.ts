export interface IMessage {
  id: string;
  data: any;
  processingStartedAt?: Date;
}

export const receivedMessages: IMessage[] = [];
export const messagesInProcess: IMessage[] = [];
