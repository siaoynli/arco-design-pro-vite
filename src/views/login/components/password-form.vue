<template>
  <div class="login-form-title">{{ $t('login.form.title') }}</div>
  <div class="login-form-sub-title">{{ $t('login.form.subtitle') }}</div>

  <a-form
    ref="loginForm"
    :model="userInfo"
    class="login-form"
    layout="vertical"
    @submit="handleSubmit"
  >
    <a-form-item
      field="email"
      :rules="[{ type: 'email', required: true, message: '请输入邮箱地址' }]"
      :validate-trigger="['change', 'blur']"
      hide-label
    >
      <a-input v-model="userInfo.email" placeholder="请输入邮箱地址">
        <template #prefix>
          <icon-email />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item
      field="password"
      :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
      :validate-trigger="['change', 'blur']"
      hide-label
    >
      <a-input-password
        v-model="userInfo.password"
        placeholder="请输入密码"
        allow-clear
      >
        <template #prefix>
          <icon-lock />
        </template>
      </a-input-password>
    </a-form-item>
    <a-space :size="16" direction="vertical">
      <div class="login-form-password-actions">
        <a-tooltip content="此操作可能会造成安全隐患">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
        </a-tooltip>
        <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
      </div>
      <a-button type="primary" html-type="submit" long :loading="loading">
        {{ $t('login.form.login') }}
      </a-button>
    </a-space>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore, usePublicKeyStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();
  const publicKeyStore = usePublicKeyStore();

  const publicKey = ref<string>('');

  const loginConfig = useStorage('login-password-config', {
    rememberPassword: false,
    email: '',
    password: '',
  });

  const userInfo = reactive({
    email: loginConfig.value.email,
    password: loginConfig.value.password,
    loginType: 'account',
  });

  const fetchPublicKey = async () => {
    await publicKeyStore.getPublicKey();
    publicKey.value = publicKeyStore.publicKey || '';
  };
  fetchPublicKey();

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (!errors) {
      setLoading(true);
      try {
        // 记住密码是记住加密后的密码，所以不需要加密了
        const keyValue =
          loginConfig.value.rememberPassword && loginConfig.value.password
            ? ''
            : publicKey.value;
        await userStore.login(values as LoginData, keyValue);
        Message.success('登陆成功，欢迎使用!');
        const { rememberPassword } = loginConfig.value;
        const { email, password } = values;

        loginConfig.value.email = rememberPassword ? email : '';
        loginConfig.value.password = rememberPassword ? password : '';

        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        await router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };
</script>

<style lang="less" scoped>
  .login-form {
    margin-top: 32px;

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

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
