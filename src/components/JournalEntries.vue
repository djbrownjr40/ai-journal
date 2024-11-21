<template>
  <header class="background-image">
    <div class="entries-content">
      <h3>エントリーの一覧</h3>
      <div class="select-all-container">
        <button @click="toggleSelectAll" :class="{ 'active': selectAll }">
          <i :class="selectAll ? 'fa-solid fa-check-square' : 'fa-solid fa-square'"></i>
          <span> すべて選択</span>
        </button>

        <select v-model="sortOption" @change="sortEntries" class="sort-select">
          <option value="date-asc">Creation Date (oldest first)</option>
          <option value="date-desc">Creation Date (newest first)</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>

        <input type="text" v-model="searchQuery" placeholder="キーボード検索" class="search-input"/>
      </div>


      <div class="entries-container">
        <ul>
          <!-- <li v-for="entry in journalEntries" :key="entry.id"  -->
          <li v-for="entry in filteredEntries" :key="entry.id" 
              class="entry-card" 
              :class="{ 'selected': selectedEntries.includes(entry.id) }">
            <input type="checkbox" 
                   :id="'checkbox-' + entry.id" 
                   :value="entry.id" 
                   v-model="selectedEntries" 
                   class="custom-checkbox">
            <label :for="'checkbox-' + entry.id"></label>
            <div class="date-container">
              <span class="entry-date">{{ formatDate(entry.createdOn) }}</span>
            </div>
            <div class="entry-details">
              <router-link :to="`/entries/${entry.id}`" class="entry-link">
                <h4 class="entry-title">{{ entry.title }}</h4>
                <p class="entry-preview">{{ entry.content.slice(0, 150) }}...</p>
              </router-link>
            </div>
            <router-link :to="`/entries/${entry.id}`" class="edit-link">
              <i class="fa-solid fa-pen-to-square"></i>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="delete-button-container">
        <button @click="deleteSelectedEntries" :disabled="selectedEntries.length === 0" class="{ 'active': selectedEntries.length > 0}">
          <i class="fa-solid fa-trash-can"></i> 削除
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import axios from 'axios';

interface JournalEntry {
  id: number;
  title: string;
  createdOn: string;
  content: string;
}

export default defineComponent ({
  name: 'JournalEntries',
  setup() {
    // const journalEntries = ref<JournalEntry[]>([
    //   { id: 1, title: 'a Sample Entry 1', createdOn: new Date().toISOString(), content: 'there once was a man from nantucket' },
    //   { id: 2, title: 'j Sample Entry 2', createdOn: new Date().toISOString(), content: 'there once was a man from nantucket' },
    //   { id: 3, title: 'z Sample Entry 3', createdOn: new Date().toISOString(), content: 'there once was a man from nantucket' },
    // ]);
    const journalEntries = ref<JournalEntry[]>([]);
    const selectedEntries = ref<number[]>([]);
    const selectAll = ref(false);
    const sortOption = ref('date-asc');
    const searchQuery = ref('');

    const loadEntries = async () => {
      try {
    const token = localStorage.getItem('token'); // Ensure you retrieve the token
    const response = await axios.get<{ id: number; title: string; createdOn: string, content: string }[]>('http://157.7.86.182:3000/api/entries', {
      headers: {
        Authorization: `Bearer ${token}` // Send the token in the headers
      }
    });


    // Map the response to the JournalEntry interface
    journalEntries.value = response.data.map(entry => ({
      id: entry.id,
      title: entry.title,
      // createdOn: new Date(entry.createdOn).toLocaleDateString(),
      createdOn: new Date(entry.createdOn).toISOString(),
      content: entry.content
    }));

    sortEntries();
    updateSelectedEntries(); 
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      console.error('Error loading entries:', error.response?.data || error.message);
    } else {
      // Handle other types of errors
      console.error('Unexpected error:', (error as Error).message);
    }
  }
};

const filteredEntries = computed(() => {
    return journalEntries.value.filter(entry => {
      return entry.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  });

const sortEntries = () => {
    if (sortOption.value === 'date-asc') {
      journalEntries.value.sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());
    } else if (sortOption.value === 'date-desc') {
      journalEntries.value.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
    } else if (sortOption.value === 'title-asc') {
      journalEntries.value.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption.value === 'title-desc') {
      journalEntries.value.sort((a, b) => b.title.localeCompare(a.title));
    }
  };

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedEntries.value = [];
        selectAll.value = false;
      } else {
        selectedEntries.value = journalEntries.value.map(entry => entry.id);
        selectAll.value = true;
      }
    };

    const updateSelectedEntries = () => {
      selectAll.value = selectedEntries.value.length === journalEntries.value.length;
    };

    const deleteSelectedEntries = async () => {
      if (selectedEntries.value.length === 0) return;

      try {
        await Promise.all(selectedEntries.value.map(id =>
          axios.delete(`http://157.7.86.182:3000/api/entries/${id}`)
        ));
        loadEntries();
        selectedEntries.value = [];
        selectAll.value = false;
      } catch (error) {
        console.error('Error deleting entries:', error);
      }
    };

    loadEntries();

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return `${formattedDate}\n${formattedTime}`;
    };

    return {
      journalEntries,
      selectedEntries,
      selectAll,
      sortOption,
      searchQuery,
      filteredEntries,
      toggleSelectAll,
      deleteSelectedEntries,
      formatDate,
      sortEntries,
      loadEntries
    };
  },
});

</script>

<style scoped>
/* Background */
.background-image {
  position: absolute;
  top: 20vh;
  left: 0;
  width: 100%;
  height: 100vh;
  background: url('@/assets/cover.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main Content */
.entries-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  color: #000;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ddd;
  box-sizing: border-box;
}

/* Entry Cards */
.entry-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 69%;
  border: 2px solid transparent; 
  transition: border-color 0.3s;
  margin-left: 20px;
}

.entry-card.selected {
  border-color: #ff00ff;
  animation: flash 1s infinite;
}

@keyframes flash {
  0% { border-color: #ff77ff; transform: scale(1); }
  50% { border-color: #ff00ff; transform: scale(1.05); }
  100% { border-color: #ff77ff; transform: scale(1); }
}

/* Date Container */
.date-container {
  width: 75px;
  height: 75px;
  background-color: rgba(255, 135, 125, 0.6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9em;
  margin-right: 15px;
}

.entry-date {
  white-space: pre-line;
  text-align: center;
}

/* Entry Details */
.entry-details {
  flex: 1;
}

.entry-title {
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

.entry-preview {
  margin: 5px 0 0 0;
  color: #666;
}

/* Edit Link */
.edit-link {
  margin-left: auto;
  text-decoration: none;
  padding: 10px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #2B2D42;
}

.edit-link:hover {
  text-decoration: underline;
}

/* Buttons and Inputs */
button,
.sort-select,
.search-input {
  background: rgba(0, 255, 255, 0.4);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 16px;
  font-size: 16px;
  display: flex;
  align-items: center;
  /* height: 44px; */

  line-height: 1; /* Prevent text scaling with height */
  display: flex;
  align-items: center; /* Center items vertically */
}

button {
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button:disabled {
  background-color: #e0e0e0;
  color: #6c757d;
  cursor: default;
}

button:hover {
  background-color: #c82333;
}

button:active {
  transform: scale(0.98);
}

/* Custom Checkbox */
input[type="checkbox"] {
  display: none;
}

.custom-checkbox + label {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #ddd;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.custom-checkbox:checked + label {
  background: #c82333;
}

.custom-checkbox:checked + label:after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Select and Search Container */
.select-all-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.select-all-container button,
.select-all-container select,
.select-all-container .search-input {
  margin-right: 10px;
}

.select-all-container button, .sort-select, .search-input {
  background-color: #2B2D42;
}

.select-all-container button:hover {
  background: rgba(0, 123, 255, 0.3);
}

.select-all-container select:hover,
.select-all-container .search-input:hover {
  background: rgba(0, 123, 255, 0.3);
}

.select-all-container select:focus,
.select-all-container .search-input:focus {
  outline: none;
  border: 2px solid rgba(0, 123, 255, 0.5);
}

.delete-button-container button {
  background-color: #dc3545; /* Red background */
  color: #fff; /* White text */
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

/* .delete-button-container button:hover {
  background-color: #c82333; 
  color: white;
} */

.delete-button-container button:disabled {
  background-color: #e0e0e0; /* Gray when disabled */
  color: #6c757d; /* Gray text when disabled */
}

.delete-button-container button:hover {
  background: #dc3545;
  color: white;
}

.delete-button-container button.active {
  background: #dc3545; /* Red when active */
  color: #fff; /* Ensure text is white */
}

.search-input {
  flex-shrink: 0;
}

.search-input::placeholder {
  color: white;
  opacity: 0.7;
}

/* Entries Container */
.entries-container {
  max-height: 400px;
  overflow-y: auto;
  margin-left: 20px;
}

/* Delete Button */
.delete-button-container {
  text-align: left;
}

/* List Styles */
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.entry-link {
  text-decoration: none;
  color: inherit;
}

.entry-link:hover {
  text-decoration: underline;
}
</style>
