import axios, { AxiosError } from 'axios';

const apiKey = ''; // Replace with your API key

const api = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
});

interface ChatCompletionChoice {
  message: {
    content: string;
  }
}

interface ChatCompletionResponse {
  choices: ChatCompletionChoice[];
}

export const sendMessage = async (message: string): Promise<string> => {
  try {
    const response = await api.post<ChatCompletionResponse>('/chat/completions', {
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
      messages: [{ role: 'user', content: message }],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};


export const getDailyPrompt = async (): Promise<string> => {
  try {
    const response = await api.post<ChatCompletionResponse>('/chat/completions', {
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
      messages: [
        {
          role: 'system',
          content: 'あなたは役立つアシスタントです。すべての回答を日本語で提供してください。日本語で日記のための創造的なライティングプロンプトを提供してください。プロンプトの後に、15個の語彙と3の文法ポイントをHTML形式で提供してください。プロンプトは、リストの前に含めてください。語彙は<ul>タグを使用してリスト形式で、各語彙は<li>タグで囲んでください。文法ポイントも同様に<ul>リスト形式で提供してください。不要な前置きや追加の言葉は含めず、指示に従ってHTML形式のみで応答してください。'
        },
        {
          role: 'user',
          content: '今日の日記のために新しいプロンプトをください。'
        },
      ],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching prompt:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const requestCustomPrompt = async (topic: string): Promise<string> => {
  try {
    const response = await api.post<ChatCompletionResponse>('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `あなたは役立つアシスタントです。すべての回答を日本語で提供してください。日本語で日記のためのカスタムプロンプトを提供してください。ユーザーが指定したテーマに基づいてプロンプトを作成してください。プロンプトは、リストの前に含めてください。`
        },
        {
          role: 'user',
          content: `テーマ: ${topic}`
        },
      ],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error requesting custom prompt:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
