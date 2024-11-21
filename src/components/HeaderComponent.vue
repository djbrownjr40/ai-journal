<template>
  <header :class="headerClass">
    <h1>{{ title }}</h1>

    <div class="login-user" v-if="currentUsername">
      <div class="username-display">
        ログイン中 : {{ currentUsername }}
      </div>
      <button class="btn btn-80" @click="logout">ログアウト</button>
    </div>

    <div class="login-user" v-else>
      <router-link to="/login" class="btn-80">ログイン</router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
// import { Router } from 'vue-router'; // Import Router type
import { useRouter } from 'vue-router'; // Import useRouter here

export default defineComponent({
  name: 'HeaderComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
    headerClass: {
      type: String,
      default: 'default-header',
    },
  },
  setup() {
    const router = useRouter();

    const getUsername = inject<() => string>('getUsername');
    const setUsername = inject<(username: string) => void>('setUsername'); // eslint-disable-line no-unused-vars
    // const router = inject<Router>('router'); // Inject the router with its type

    const currentUsername = getUsername ? getUsername() : '';

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      if (setUsername) setUsername('');
      router.push('/login'); // Redirects to login page

      // if (router) {
      //   router.push('/login'); // Now this will work without TypeScript errors
      // }
    };

    return {
      logout,
      currentUsername,
    };
  },
});

</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between; /* Space between title and login-user */
  align-items: center; /* Center items vertically */
}

.login-user {
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: flex-start; /* Align items to the left */
  margin-bottom: 0; /* Adjust as needed */
  margin-right: 80px;
  color: #fff;
}

.username-display {
  margin-bottom: 10px; /* Space between the username and the button */
}

.btn {
  margin-left: 10px; /* Space between username and logout button */
}

.btn-80,
.btn-80 *,
.btn-80 :after,
.btn-80 :before,
.btn-80:after,
.btn-80:before {
  border: 0 solid;
  box-sizing: border-box;
}
.btn-80 {
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: button;
  background-color: #fff;
  background-image: none;
  color: #ff877d;
  cursor: pointer;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
    Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
    font-size: 0.9rem; /* Adjust font size to make it smaller */
  font-weight: 900;
  line-height: 1.2;
  margin: 0;
  -webkit-mask-image: -webkit-radial-gradient(#000, #fff);
  padding: 0;
  text-decoration: none;
  
}
.btn-80:disabled {
  cursor: default;
}
.btn-80:-moz-focusring {
  outline: auto;
}
.btn-80 svg {
  display: block;
  vertical-align: middle;
}
.btn-80 [hidden] {
  display: none;
}
.btn-80 {
  border: 2px solid;
  border-radius: 999px;
  box-sizing: border-box;
  display: block;
  overflow: hidden;
  padding: 1.2rem 3rem;
  position: relative;
  text-transform: uppercase;
}
.btn-80 span {
  font-weight: 900;
  mix-blend-mode: difference;
}
.btn-80:before {
  background: #fff;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
}
.btn-80:hover:before {
  -webkit-animation: progress-bar 1.2s;
  animation: progress-bar 1.2s;
}
@-webkit-keyframes progress-bar {
  0% {
    opacity: 1;
    width: 0;
  }
  10% {
    opacity: 1;
    width: 15%;
  }
  25% {
    opacity: 1;
    width: 25%;
  }
  40% {
    opacity: 1;
    width: 35%;
  }
  55% {
    opacity: 1;
    width: 75%;
  }
  60% {
    opacity: 1;
    width: 100%;
  }
  to {
    opacity: 0;
    width: 100%;
  }
}
@keyframes progress-bar {
  0% {
    opacity: 1;
    width: 0;
  }
  10% {
    opacity: 1;
    width: 15%;
  }
  25% {
    opacity: 1;
    width: 25%;
  }
  40% {
    opacity: 1;
    width: 35%;
  }
  55% {
    opacity: 1;
    width: 75%;
  }
  60% {
    opacity: 1;
    width: 100%;
  }
  to {
    opacity: 0;
    width: 100%;
  }
}

/* .default-header {
  background-color: #f8f9fa;
  padding: 10px;
  text-align: center;

  position: sticky; 
  top: 0; 
  text-align: center;
  z-index: 1000;
}

.custom-header {
  background-color: #343a40;
  color: #fff;
  padding: 10px;
  text-align: center;
} */

.login-user {
  margin-bottom: 40px; /* Increased margin to move the nav further down */
}

/* .nav-container {
  margin-top: 440px; 
} */

nav {
  display: flex;
  justify-content: center; /* Center the links horizontally */
  align-items: center; /* Center the links vertically if needed */
}

nav ul {
  list-style-type: none; /* Remove default list dots */
  padding: 0;
  margin: 0;
  display: flex; /* Display links in a row */
}

nav ul li {
  margin: 0 15px; /* Horizontal spacing between items */
  position: relative; /* Make sure the li is positioned relative */
}


.nav-link {
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.2em; /* Adjust font size if needed */
  padding: 5px 10px; /* Space around the text for better hover effect */
  position: relative; /* Make sure the link is positioned relative */
  transition: color 0.3s ease; /* Smooth transition for text color */
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 110%; /* Slightly wider than the text */
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 0, 255, 0.5) 0%, /* Semi-transparent magenta */
    rgba(255, 0, 255, 0.3) 50%, /* Fading effect */
    rgba(255, 0, 255, 0.5) 100%
  ); /* Gradient for a more natural look */
  transform: translateY(-50%) rotate(-5deg); /* Tilt the gradient for realism */
  z-index: -1;
  opacity: 0;
  border: 1px solid red; /* Temporary border for debugging */

  transition: opacity 0.3s ease; /* Smooth transition for hover effect */
}

.nav-link:hover::before {
  opacity: 1; /* Show highlighter effect on hover */
}

</style>