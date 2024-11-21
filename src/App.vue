<template>
  <div id="app">
    <HeaderComponent v-if="$route.name !== 'Landing' && $route.name !== 'LoginPage'" title="" headerClass="banner-image" />
    <NavLinks v-if="$route.name !== 'Landing' && $route.name !== 'LoginPage'"/>
    <main class="content">
      <router-view @user-logged-in="updateUsername" />
    </main>
  </div>
</template>

<!-- <template>
  <div id="app">
    <HeaderComponent title="" headerClass="banner-image" />
    <NavLinks />
    <main class="content">
      <router-view @user-logged-in="updateUsername" />
    </main>
  </div>
</template> -->

<script lang="ts">
// import { Options, Vue } from 'vue-class-component';
import { defineComponent } from 'vue';
// import { RouterView } from 'vue-router';
import axios from 'axios';
import HeaderComponent from './components/HeaderComponent.vue';
import NavLinks from './components/NavLinks.vue';


// @Options({
//   components: {
//     HeaderComponent,
//     NavLinks,
//     RouterView
//   },
// })
// export default class App extends Vue {
//   username: string = '';

export default defineComponent({
  components: {
    HeaderComponent,
    NavLinks,
  },
  data() {
    return {
      username: '',
    };
  },
  provide() {
    return {
      getUsername: () => this.username,
      setUsername: (name: string) => {
        this.username = name;
      },
    };
  },
  mounted() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');


  const isLandingPage = this.$route.name === 'Landing';
  const isHomePage = this.$route.name === 'HomePage';

  if (!isLandingPage && !isHomePage) {
    if (token && username) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('http://157.7.86.182:3000/api/verify-token')
        .then(() => {
          this.updateUsername(username);
        })
        .catch(() => {
          // Token is invalid
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          this.$router.push('/login'); // Redirect to login
        });
    } else {
      this.$router.push('/login'); // Redirect to login
    }
  }
  // If on landing or home page, no redirect occurs
},
//   if (token && username) {
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     axios.get('http://157.7.86.182:3000/api/verify-token')
//       .then(() => {
//         this.updateUsername(username);
//       })
//       .catch(() => {

//         localStorage.removeItem('token');
//         localStorage.removeItem('username');

//         if (!isLandingPage && !isHomePage) {
//           this.$router.push('/login');
//         }
//       });
//   } else {

//     if (!isLandingPage && !isHomePage) {
//       this.$router.push('/login');
//     }
//   }
// },
  methods: {
    updateUsername(username: string) {
      this.username = username;
    },
  },
});
</script>

<style>
.highlight {
  color: #ff00ff; /* Highlight color */
}

.normal {
  color: #ff0000; /* Normal color */
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  font-family: Arial, sans-serif;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

ul {
  list-style-type: none; /* Remove default list dots */
  padding: 0;
  margin: 0;
}

.banner-image {
  margin: 0 !important;
  width: 100vw;
  height: 20vh;
  background: url('@/assets/banner_new.png') no-repeat center center;
  background: url('@/assets/header2.png') no-repeat center center;
  background-size: cover;
  background-position: center 70%; /* Move the image up by 20% of its height */
  position: fixed;
  top: 0;
  z-index: 1000;
}

.header-content {
  position: absolute;
  top: 0; /* Align header content at the top */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  z-index: 1; /* Ensure header content is on top */
  color: #fff;
}

.login-user {
  margin-bottom: 40px; /* Adjust margin to create space */
}

.content {
  position: relative;
  z-index: 2;
  padding: 20px;
  padding-left: 20px; /* Ensure space on the left side */
  padding-right: 20px; /* Ensure space on the right side */
  color: #000; /* Change text color as needed */
}

section {
  padding: 20px;
  text-align: center;
}
</style>