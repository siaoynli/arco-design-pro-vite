<template>
  <div class="account-root">
    <div class="account-root-item">
      <div class="root-left-item">
        <img src="@/assets/images/logo-img.jpg" alt="" />
        <h3>{{ $t('login.form.welcome') }}</h3>
      </div>
      <div class="root-right-item">
        <div class="cursor-pointer corner" @click="switchLogin">
          <a-tooltip v-if="isPasswordLogin" content="密码登陆">
            <icon-reply size="32" />
          </a-tooltip>
          <a-tooltip v-else content="微信扫码登陆">
            <icon-scan size="32" />
          </a-tooltip>
        </div>
        <div class="account-form">
          <QRcode v-show="isPasswordLogin" />
          <LoginForm v-show="!isPasswordLogin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import LoginForm from './components/login-form.vue';
  import QRcode from './components/qr-code.vue';

  const isPasswordLogin = ref<boolean>(false);

  const switchLogin = () => {
    isPasswordLogin.value = !isPasswordLogin.value;
  };
</script>

<style lang="less" scoped>
  .account-root {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background-color: var(--bg-color-1);

    .account-root-item {
      width: 1000px;
      height: 560px;
      overflow: hidden;
      background: var(--bg-color-2);
      box-shadow: #0003 0 0 20px;
    }

    .root-left-item {
      position: relative;
      float: left;
      width: 50%;
      height: 100%;

      h3 {
        position: absolute;
        top: 95px;
        left: 0;
        width: 100%;
        color: #818181;
        text-align: center;
      }
    }

    .root-right-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      float: left;
      width: 500px;
      height: 100%;
      background-color: var(--color-bg-3);

      .corner {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background: rgb(var(--primary-6));
        border-radius: 0 0 0 150%;

        svg {
          margin-top: -10px;
          margin-right: -20px;
          color: #fff;
        }
      }
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .account-root {
      .account-root-item {
        width: 500px;
      }

      .root-left-item {
        display: none;
      }
    }
  }
</style>
