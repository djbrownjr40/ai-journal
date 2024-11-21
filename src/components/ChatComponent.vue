<!-- src/components/ChatComponent.vue -->
<template>
  <div class="chat-container">
    <div class="messages">
      <h3>チャットアシスタントと話す</h3>

      <div v-for="(message, index) in messages" :key="index" class="message">
        <div v-if="message.type === 'bot'" class="bot-message">
          <img src="@/assets/chatbot.png" alt="Chatbot" class="profile-pic" />
          <div class="speech-bubble">{{ message.text }}</div>
        </div>
        <div v-if="message.type === 'user'" class="user-message">
          <div class="bubble">{{ message.text }}</div>
      </div>
    </div>
  </div>

  <div class="input-container">
    <input v-model="inputMessage" 
      @keyup.enter="sendMessage" 
      placeholder="何かを聞いてください。"
    />
    <button @click="sendMessage">送信</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Message } from 'src/types/Message';
import { sendMessage } from '../services/chatgptService';

export default defineComponent({
  name: 'ChatComponent',
  setup() {
    const inputMessage = ref<string>('');
    const messages = ref<Message[]>([]);

    const defaultBotMessage = '今日はどのようなお手伝いできますか？';

    const sendMessageHandler = async () => {
      if (!inputMessage.value.trim()) return;

      messages.value.push({ text: inputMessage.value, type: 'user'});

      const messageToSend = inputMessage.value;
      inputMessage.value = '';

      try{
        const response = await sendMessage(messageToSend);
        messages.value.push({ text: response, type: 'bot'});
      } catch (error){
        messages.value.push({ text: 'Error: Unable to get response.', type: 'bot' });
      }
    };

    onMounted(() => {
      messages.value.push({ text: defaultBotMessage, type: 'bot' });
    })
  
  return {
    inputMessage,
    messages,
    sendMessage: sendMessageHandler,
  };
},
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  /* padding: 10px; */
}

.message {
  margin-bottom: 10px;
}

.bot-message {
  display: flex;
  align-items: flex-start;
}

.user-message {
  display: flex;
  justify-content: flex-end;
}

.profile-pic {
  width: 55px; /* Adjust size as needed */
  height: 55px;
  border-radius: 50%; /* Make it circular */
  margin-right: 10px; /* Space between pic and text */
}

.speech-bubble {
  background-color: #e1f5fe; /* Light blue for bot messages */
  padding: 10px;
  border-radius: 15px;
  max-width: 70%; /* Limit width */
  color: #2c3e50;
}

.bubble {
  background-color: rgba(255, 135, 125, 0.6); /* Softened color with transparency */
  padding: 10px;
  border-radius: 15px;
  max-width: 70%; /* Limit width */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: Add a slight shadow for depth */
  color: #2c3e50;
}

.input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc; /* Divider line */
}

input {
  flex: 1; /* Take up available space */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px; /* Space between input and button */
}

button {
  padding: 10px 15px;
  background-color: #2B2D42;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #ff877d
}

</style>
