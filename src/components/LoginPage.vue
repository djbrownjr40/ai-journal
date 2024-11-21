<template>
  <div class="login-background">
  <div id="login-page">
    <div class="form-container">
      <h3>ログイン</h3>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">ユーザー名:</label>
          <input type="text" v-model="username" id="username" required />
        </div>
        <div class="form-group">
          <label for="password">パスワード:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button class="btn" type="submit">ログイン</button>
      </form>

      <p class="signup-link">
        アカウントをお持ちでないですか？ <router-link to="/create-user">新規作成はこちら</router-link>
      </p>
    </div>
  </div>
</div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup(_, { emit }) {
    const router = useRouter(); // Get the router instance
    const username = ref<string>('');
    const password = ref<string>('');

    const login = async (): Promise<void> => {
      try {
        const response = await axios.post<{ token: string }>('http://157.7.86.182:3000/api/login', {
          username: username.value,
          password: password.value 
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username.value);

        // Notify that user info has been updated
        emit('user-logged-in', username.value);
        router.push('/');
      } catch (error) {
        console.error(error);
        alert('Login failed');
      }
    };

    return {
      username,
      password,
      login,
    };
  },
});
</script>
  
  <style scoped>

.login-background {
    top: 65vh;
  }

  .form-container {
    top: 45vh;
    margin-top: 200px;
  }

  #login-page {
    font-family: Arial, sans-serif;
    margin-top: 200px; /* Adjust if necessary */
  }
  
  .form-container {
    margin-top: 200px;
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 16px;
    color: #333;
  }
  
  .form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
  }
  
  .btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(45deg, #ff00ff, #00ffff);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s, box-shadow 0.3s;
  }
  
  .btn:disabled {
    background: #d6d6d6;
    cursor: not-allowed;
  }
  
  .btn:hover:not(:disabled) {
    background: linear-gradient(45deg, #ff877d, #ff00ff);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .signup-link {
  text-align: center;
  margin-top: 20px;
}

.signup-link a {
  color: #ff877d;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
  </style>
  