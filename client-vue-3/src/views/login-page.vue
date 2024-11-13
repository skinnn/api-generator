<script>
import LoginForm from '@/components/auth/LoginForm.vue'

export default {
  components: { LoginForm },
  setup() {}
}
</script>

<template>
  <div class="login-page">
    <LoginForm />
  </div>
</template>

<style lang="scss" scoped>
.login-page {
	padding: 20vh;
	min-height: 100vh;
	background-color: #333;
	height: 100%;
}
</style>
