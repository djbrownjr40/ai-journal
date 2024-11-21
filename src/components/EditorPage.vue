<template>
  <header class="journal-background-image">
    <div class="journal-page">

      <div class="left-column">
        <div class="tabs">
          <button @click="showDailyPrompt" :class="{ active: currentTab === 'daily' }"><i
              class="fa-solid fa-pen-nib"></i></button>
          <button @click="showCustomPrompt" :class="{ active: currentTab === 'custom' }"><i
              class="fa-solid fa-file-circle-question"></i></button>
          <button @click="showChat" :class="{ active: currentTab === 'chat' }"><i
              class="fa-solid fa-comment-dots"></i></button>
        </div>

        <div class="prompt-container">
          <div v-if="currentTab === 'daily' && dailyPrompt" class="formatted-prompt">
            <h3 class="prompt-header daily-prompt-header">今日のライティングプロンプト</h3>
            <p v-html="dailyPrompt" class="formatted-prompt"></p>
          </div>

          <div v-if="currentTab === 'daily'">
            <div class="button-div">
              <button @click="fetchNewPrompt" class="refresh-button">
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>

          <div v-if="currentTab === 'custom' && showCustomPromptSection" class="custom-prompt-container">
            <h3 class="prompt-header">カスタムプロンプトをリクエストする</h3>
            <form @submit.prevent="submitCustomPromptRequest">
              <input type="text" v-model="customPromptTopic" placeholder="プロンプトのトピックまたはテーマを入力してください" required />
            </form>

          </div>

          <ChatComponent v-if="currentTab === 'chat'" />
        </div>
      </div>

      <div class="right-column">
        <div class="editor-container">
          <trumbowyg-editor :entry-id="entryId.toString()" :initial-title="entryTitle" :initial-content="entryContent"
            ref="editorRef" @update:title="entryTitle = $event" />
          <button @click="saveEntry" class="refresh-button">
            <i class="fa-solid fa-floppy-disk"></i>
          </button>

        </div>
      </div>

    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import ChatComponent from './ChatComponent.vue';
import TrumbowygEditor from './TrumbowygEditor.vue';
import { getDailyPrompt, requestCustomPrompt } from '../services/chatgptService';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: {
    ChatComponent,
    TrumbowygEditor,
  },
  setup() {
    const route = useRoute();
    const entryId = ref<number>(Number(route.params.id));
    const entryTitle = ref<string>('');
    const entryContent = ref<string>('');
    const dailyPrompt = ref<string>('');
    const customPromptTopic = ref<string>('');
    const customPromptResponse = ref<string>('');
    const showChatComponent = ref<boolean>(false);
    const showCustomPromptSection = ref<boolean>(false);
    const currentTab = ref<string>('daily');
    const editorRef = ref<InstanceType<typeof TrumbowygEditor> | null>(null);

    const fetchDailyPrompt = async () => {
      try {
        dailyPrompt.value = await getDailyPrompt();
      } catch (error) {
        console.error('Error fetching daily prompt:', error);
      }
    };

    const fetchNewPrompt = async () => {
      await fetchDailyPrompt();
    };

    const submitCustomPromptRequest = async () => {
      try {
        customPromptResponse.value = await requestCustomPrompt(customPromptTopic.value);
        customPromptTopic.value = ''; // Clear input after request
      } catch (error) {
        console.error('Error requesting custom prompt:', error);
      }
    };

    const saveEntry = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('token');
        const content = editorRef.value?.entryContent; // Get content from the editor
        // const content = entryContent.value; // Get content from entryContent
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        console.log('Saving entry:', {
          title: entryTitle.value,
          content
        });

        await axios.post(`http://157.7.86.182:3000/api/entries`,
          { title: entryTitle.value, content },
          config
        );

        console.log('Entry saved successfully!');
      } catch (error) {
        console.error('Error saving entry:', error);
      }
    };

    const showChat = () => {
      currentTab.value = 'chat';
    };

    const showDailyPrompt = () => {
      currentTab.value = 'daily';
      showCustomPromptSection.value = false;
    }

    const showCustomPrompt = () => {
      currentTab.value = 'custom';
      showCustomPromptSection.value = true;
    }

    onMounted(async () => {
      console.log('Component mounted');

      await fetchDailyPrompt(); // Fetch daily prompt on mount
      showDailyPrompt();
    });

    return {
      entryId,
      entryTitle,
      entryContent,
      editorRef,
      dailyPrompt,
      customPromptTopic,
      showChatComponent,
      showCustomPromptSection,
      fetchNewPrompt,
      submitCustomPromptRequest,
      saveEntry,
      showChat,
      showDailyPrompt,
      showCustomPrompt,
      currentTab,
    };
  },
});
</script>

<style scoped>
.tabs {
  display: flex;
  justify-content: space-around;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 10px 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.tabs button {
  background-color: transparent;
  border: none;
  border-radius: 20px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  width: 50px;
  height: 50px;
}

.tabs button i {
  font-size: 24px;
  color: #2B2D42;
}

.tabs button.active {
  background-color: rgba(0, 123, 255, 0.3);
}

.tabs button.active i {
  color: #FFFFFF;
}

.journal-background-image {
  position: absolute;
  top: 20vh;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/texture.png');
  background-size: cover;
  background-color: #f8f8f8;
  z-index: 1;
}

.journal-page {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}

.right-column {
  flex: 1;
}

.prompt-container,
.editor-container {
  flex: 1;
  box-sizing: border-box;
  max-height: 630px;
  overflow-y: auto;
}

.prompt-container {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 20px;
  max-height: 630px;
  overflow-y: auto;
}

.prompt-container h3,
.prompt-container p {
  margin: 20px 0;
}

.prompt-container h3 {
  margin: 10px 0;
  font-size: 1.2em;
  line-height: 1.5;
  padding-top: 0;
}

.editor-container {
  display: flex;
  flex-direction: column;
  background-color: #FDFFFC;
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
}

textarea#editor {
  width: 100%;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.title-input {
  width: 100%;
  padding: 10px;
  font-size: 1.2em;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
}


button:hover {
  background-color: #E3E0DD;
}

.button-div {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.refresh-button {
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  font-size: 24px;
  background-color: transparent;
}

.refresh button i {
  font-size: 24px;
}

.refresh-button:hover {
  background-color: #E3E0DD;
  color: #2B2D42;
}

.prompt-header {
  margin-bottom: 10px;
  font-size: 1.2em;
  line-height: 1.5;
  padding-top: 10px;
}

.prompt-container,
.custom-prompt-container {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
}

.prompt-container h3,
.custom-prompt-container h3 {
  margin-bottom: 10px;
  font-size: 1.2em;
}

.prompt-container form,
.custom-prompt-container form {
  display: flex;
  flex-direction: column;
}

.prompt-container input,
.custom-prompt-container input {
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

.custom-prompt-container .request-button {
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.custom-prompt-container .request-button:hover {
  background-color: #0056b3;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
}

.messages .user {
  color: #AB2346;
  text-align: right;
  margin-bottom: 10px;
}

.messages .bot {
  color: #0E273C;
  text-align: left;
  margin-bottom: 10px;
}

.formatted-prompt {
  text-align: left;
}

.formatted-prompt ul {
  padding-left: 20px;
}

.formatted-prompt li {
  margin-bottom: 5px;
}

.update-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #2B2D42;
  width: 10%;
  margin-right: auto;
}

.update-button:hover {
  color: #667761;
  background-color: #DCEAB2;
}
</style>
