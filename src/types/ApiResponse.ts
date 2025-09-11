import { Message } from "@/models/Users";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages: boolean;
  messages?: Array<Message>
};