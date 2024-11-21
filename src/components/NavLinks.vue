<template>
  <div class="nav-links-container">
    <nav>
      <ul>
        <li><router-link to="/home" class="nav-link">ホーム</router-link></li>
        <li><router-link to="/entries" class="nav-link">エントリーの一覧</router-link></li>
        <li><router-link to="/editor" class="nav-link">日記</router-link></li>
        <li><router-link to="/" class="nav-link">landing</router-link></li>

      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent ({
  name: 'NavLinks',
});

</script>

<style scoped>
.nav-links-container {
  position: fixed; /* Change to fixed positioning */
  top: 3vh; /* Position it just below the banner */
  width: 100%;
  text-align: center;
  z-index: 2000; /* Higher z-index to appear above the banner */
  padding: 10px 0;
}

nav {
display: flex;
justify-content: center;
}

nav ul {
list-style-type: none;
padding: 0;
margin: 0;
display: flex;

}

nav ul li {
margin: 0 15px;
}

.nav-link {
color: #fff;
text-decoration: none;
font-size: 1.2em;
position: relative;
padding: 5px 10px;
transition: color 0.3s ease;

}

.nav-link::before {
content: '';
position: absolute;
top: 50%;
left: 0;
width: 110%;
height: 100%;
background: linear-gradient(
  135deg,
  rgba(255, 0, 255, 0.5) 0%,
  rgba(255, 0, 255, 0.3) 50%,
  rgba(255, 0, 255, 0.5) 100%
);
transform: translateY(-50%) rotate(-5deg);
z-index: -1;
opacity: 0;
transition: opacity 0.3s ease;
}

.nav-link:hover::before {
opacity: 1;
}
</style>