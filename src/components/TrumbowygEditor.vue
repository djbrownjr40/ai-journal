<template>
  <div class="editor-container">
    <input 
      v-model="entryTitle" 
      placeholder="タイトル" 
      class="title-input" 
    />
    <div :style="{ textAlign: 'left' }">
      <textarea 
        id="editor" 
        v-model="entryContent"
      ></textarea>
    </div>
    <!-- Additional UI elements can go here -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import $ from 'jquery';
import 'trumbowyg';

export default defineComponent({
  name: 'TrumbowygEditor',
  props: {
    entryId: {
      type: String,
      required: true
    },
    initialTitle: {
      type: String,
      default: ''
    },
    initialContent: {
      type: String,
      default: ''
    }
  },
  emits: ['update:title'],
  
  setup(props, { emit }) {
    const entryTitle = ref<string>(props.initialTitle);
    const entryContent = ref<string>(props.initialContent);

    const initializeEditor = () => {
      $('#editor').trumbowyg();
      $('#editor').trumbowyg('html', entryContent.value);
      
      $('#editor').on('tbwchange', () => {
        entryContent.value = $('#editor').trumbowyg('html');
      });

    };

  onMounted(() => {
    initializeEditor();
  });

  watch(() => props.initialTitle, (newValue) => {
    if (newValue){
      entryTitle.value = newValue;
    }
  })

  watch(entryTitle, (newValue) => {  // Watch for changes in entryTitle
      emit('update:title', newValue);  // Emit change to parent
    });

  watch(() => props.initialContent, (newValue) => {
    if (newValue) {
      $('#editor').trumbowyg('html', newValue);
    }
  });

  onBeforeUnmount(() => {
      $('#editor').trumbowyg('destroy');
  });

    return {
      entryTitle,
      entryContent,
      // updateTitle,
      // updateContent
    };
  }
});
</script>

<style scoped>
.editor-container .trumbowyg-box .trumbowyg-editor {
  text-align: left !important; 
}

.trumbowyg-box,
.trumbowyg-editor {
  min-height: 950px !important;
  height: auto;
}

.editor-container {
  padding: 20px;
  flex: 1;
  margin-left: 10px;
}

.title-input {
  width: 300px;
  padding: 10px;
  font-size: 1.2em;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
}

.refresh-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px; /* Adjust icon size */
  color: #2B2D42; /* Icon color */
  width: 10%;
  margin-right: auto;
}

.refresh-button:hover {
  color: #667761; /* Icon color on hover */
  background-color: #DCEAB2;
}

textarea#editor {
  width: 100%;
  height: 800px;
  text-align: left; /* Align text to the left */
} 

button {
  width: 300px;
  margin-top: 10px;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.success-message {
  color: #28a745;
  margin-top: 10px;
}

.error-message {
  color: #dc3545;
  margin-top: 10px;
}
</style>
