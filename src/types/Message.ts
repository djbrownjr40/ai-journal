// src/types/Message.ts
export interface Message {
    text: string;  // The content of the message
    type: 'user' | 'bot'; // The sender of the message, limited to 'user' or 'bot'
  }
  