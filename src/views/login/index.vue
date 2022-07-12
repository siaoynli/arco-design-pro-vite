<template>
  <div class="account-root">
    <div class="account-root-item">
      <div class="root-left-item">
        <img src="@/assets/images/logo-img.jpg" alt="" />
        <h3>{{ $t('login.form.welcome') }}</h3>
      </div>
      <div class="root-right-item">
        <div class="cursor-pointer corner" @click="switchLogin">
          <a-tooltip :content="tooltipsTitle">
            <icon-reply v-if="loginStatus" size="32" />
            <icon-qrcode v-else size="32" />
          </a-tooltip>
        </div>
        <div class="account-form">
          <div class="login-form-wrapper">
            <QRCode v-if="loginStatus === 1" />
            <PasswordForm v-else-if="loginStatus === 2" />
            <LoginForm v-else />
            <div v-show="!loginStatus" class="mt-4 view-account-other">
              <div class="flex">
                <div class="flex-initial"><span>其它登录方式</span></div>
                <div class="flex-initial mx-2">
                  <a href="javascript:" @click="switchPassword">
                    <a-tooltip content="密码登陆">
                      <icon-lock size="24" class="icon-color" />
                    </a-tooltip>
                  </a>
                </div>

                <div class="flex-initial mx-2">
                  <a href="javascript:">
                    <a-tooltip content="支付宝授权">
                      <icon-alipay-circle size="24" class="icon-color" />
                    </a-tooltip>
                  </a>
                </div>

                <div class="flex-initial" style="margin-left: auto">
                  <a-tooltip content="创建账号，请联系管理员">
                    <a-link>{{ $t('login.form.register') }}</a-link>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import LoginForm from './components/login-form.vue';
  import PasswordForm from './components/password-form.vue';
  import QRCode from './components/qr-code.vue';

  const loginStatus = ref<number>(0);
  const tooltipsTitle = ref<string>('微信扫码登陆');

  const switchLogin = () => {
    loginStatus.value = loginStatus.value ? 0 : 1;
    tooltipsTitle.value = loginStatus.value ? '验证码登陆' : '微信扫码登陆';
  };

  const switchPassword = () => {
    loginStatus.value = 2;
    tooltipsTitle.value = '验证码登陆';
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

    .view-account-other {
      color: var(--font-color-1);

      span {
        line-height: 2em;
      }

      .icon-color {
        color: var(--icon-color-1);
      }
    }
  }
</style>

<style lang="less" scoped>
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
