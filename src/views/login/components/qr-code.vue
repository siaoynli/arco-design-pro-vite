<template>
  <div class="qrcode">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-sub-title">{{ $t('login.form.subtitle') }}</div>

    <div class="qrcode-image mb-4 mt-4">
      <div v-html="qrcodeSvg"></div>
      <div v-if="loading" class="qrcode-loading">
        <div class="qrcode-mask"></div>
        <icon-loading size="60" class="qrcode-icon-loading" />
      </div>
    </div>

    <a-space>微信扫码登陆</a-space>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onUnmounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import { clearToken, setToken } from '@/utils/auth';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { checkTicket, getQRCode } from '@/api/user';

  const { loading, setLoading } = useLoading();
  const qrcodeSvg = ref<string>('');

  const router = useRouter();

  let timer: ReturnType<typeof setInterval>;

  // 获取二维码
  const fetchQRCode = async () => {
    const result = await getQRCode();
    const { qrcode, checkUri } = result.data;
    qrcodeSvg.value = qrcode;

    let tNumber = 1;
    // 定时获取扫码状态，判断是否登陆成功
    timer = setInterval(async () => {
      tNumber += 1;
      if (tNumber >= 60) {
        // 超过1分钟刷新二维码
        clearInterval(timer);
        await fetchQRCode();
      }

      try {
        const res = await checkTicket(checkUri);
        const { status, token } = res.data;
        if (status === -1) {
          setLoading(true);
        } else {
          setLoading(false);
        }
        // 登陆成功
        if (status === 1 && token) {
          setToken(token);
          clearInterval(timer);
          Message.success('操作成功，欢迎使用!');
          const { redirect, ...othersQuery } = router.currentRoute.value.query;
          await router.push({
            name: (redirect as string) || 'Workplace',
            query: {
              ...othersQuery,
            },
          });
        }
      } catch (err) {
        clearToken();
        clearInterval(timer);
        await fetchQRCode();
        throw err;
      }
    }, 1000);
  };

  fetchQRCode();
  // 清除定时器
  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
    }
  });
</script>

<style lang="less" scoped>
  .qrcode {
    width: 265px;
    margin: 60px auto 0 auto;
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
