<template>
    <div>
        <h2>Logging out...</h2>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    created() {
        // ログアウト時にトークンを削除
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        // ログインページにリダイレクト
        this.$router.push('/login');
    }
});
</script>