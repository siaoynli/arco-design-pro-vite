<template>
  <div class="qrcode">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-sub-title">{{ $t('login.form.subtitle') }}</div>

    <div class="qrcode-image mb-4 mt-4">
      <img src="@/assets/images/wx-qrcode.png" alt="微信登陆" />
      <div class="qrcode-loading">
        <div class="qrcode-mask"></div>
        <icon-loading size="60" class="qrcode-icon-loading" />
      </div>
    </div>

    <a-space>微信扫码登陆</a-space>
  </div>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';

  const { loading, setLoading } = useLoading();
</script>

<style lang="less" scoped>
  .qrcode {
    width: 265px;
    margin: 100px auto;
    color: var(--color-text-3);
    text-align: center;
    background: none;

    .login-form {
      &-wrapper {
        width: 320px;
      }

      &-title {
        color: var(--color-text-1);
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
      }

      &-sub-title {
        color: var(--color-text-3);
        font-size: 16px;
        line-height: 24px;
      }
    }

    &-image {
      position: relative;
      width: 265px;
      height: 265px;
    }

    &-loading {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 9;
    }

    &-mask {
      position: absolute;
      z-index: 10;
      width: 100%;
      height: 100%;
      background-color: #fff;
      opacity: 0.6;
    }

    &-icon-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -30px;
      margin-left: -30px;
      color: var(--color-white);
    }
  }
</style>
