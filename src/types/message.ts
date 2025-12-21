// src/types/message.ts
export interface ISender {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface IMessage {
  _id: string;
  sender: string;
  senderName: string;
  senderEmail: string;
  message: string;
  category: string;
  status: "pending" | "in-progress" | "solved";
  createdAt: string;
  read?: boolean;
}

export interface SendMessagePayload {
  category: string;
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: IMessage;
}

export interface ReceiveMessageResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: IMessage[];
}
