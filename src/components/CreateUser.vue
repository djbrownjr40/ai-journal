<template>
  <div id="create-user">
    <div class="form-container">
      <h1>サインアップ</h1>
      <form @submit.prevent="createUser">
        <div class="form-group">
          <label for="username">ユーザー名:</label>
          <input v-model="username" type="text" id="username" required>
        </div>
      
        <div class="form-group">
          <label for="email">メール:</label>
          <input v-model="email" type="email" id="email" required>
        </div>
      
        <div class="form-group">
          <label for="password">パスワード:</label>
          <input v-model="password" type="password" id="password" required>
        </div>
      
        <div class="form-group">
          <label for="role">ロール:</label>
          <input v-model="role" type="text" id="role" disabled placeholder="user">
        </div>
      
        <button type="submit" :disabled="loading">{{ loading ? 'Creating...' : 'ユーザー登録' }}</button>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import axios from 'axios';
  
  export default defineComponent({
    name: 'CreateUser',
    setup() {
      const username = ref<string>('');
      const email = ref<string>('');
      const password = ref<string>('');
      const role = ref<string>('user'); // Default role
      const message = ref<string>(''); // For displaying success or error messages
      const loading = ref<boolean>(false); // To show loading state
  
      const createUser = async () => {
        // Client-side validation (optional)
        if (!username.value || !email.value || !password.value) {
          message.value = 'Please fill in all required fields.';
          return;
        }
  
        loading.value = true; // Set loading state
  
        try {
          // Prepare the payload
          const payload = {
            username: username.value,
            email: email.value,
            password: password.value,
            role: role.value,
          };
  
          // Send the POST request
          const response = await axios.post('http://157.7.86.182:3000/api/users', payload);
  
          // Handle successful response
          message.value = `User created successfully with ID: ${response.data.id}`;
  
          // Optionally reset the form
          username.value = '';
          email.value = '';
          password.value = '';
          role.value = 'user';
  
        } catch (error) {
          // Handle errors
          if (axios.isAxiosError(error) && error.response) {
            message.value = `Error creating user: ${error.response.data.message}`;
          } else {
            message.value = 'Error creating user: An unexpected error occurred.';
          }
        } finally {
          loading.value = false; // Reset loading state
        }
      };
  
      return {
        username,
        email,
        password,
        role,
        message,
        loading,
        createUser,
      };
    },
  });
  </script>
  
  <style scoped>

#create-user {
    font-family: Arial, sans-serif;
    margin-top: 400px; /* Adjust if necessary */
  }

  .form-container {
    max-width: 500px;
    margin: 200px auto 0; /* Move the form container down by 200px */
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background: linear-gradient(45deg, #ff00ff, #00ffff);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s, box-shadow 0.3s;
  }
  
  button:disabled {
    background: #d6d6d6;
    cursor: not-allowed;
  }
  
  button:hover:not(:disabled) {
    background: linear-gradient(45deg, #ff877d, #ff00ff);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .message {
    margin-top: 15px;
    text-align: center;
    font-size: 16px;
  }
  
  .message.error {
    color: red;
  }
  
  .message.success {
    color: green;
  }
  </style>
  