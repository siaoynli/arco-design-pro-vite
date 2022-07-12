<template>
  <div class="login-form-title">{{ $t('login.form.title') }}</div>
  <div class="login-form-sub-title">{{ $t('login.form.subtitle') }}</div>
  <div class="login-form-error-msg">{{ errorMessage }}</div>
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
        :placeholder="$t('login.form.password.placeholder')"
        allow-clear
      >
        <template #prefix>
          <icon-lock />
        </template>
      </a-input-password>
    </a-form-item>
    <a-space :size="16" direction="vertical">
      <div class="login-form-password-actions">
        <a-checkbox
          checked="rememberPassword"
          :model-value="loginConfig.rememberPassword"
          @change="setRememberPassword"
        >
          {{ $t('login.form.rememberPassword') }}
        </a-checkbox>
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
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage('login-password-config', {
    rememberPassword: false,
    email: 'admin@admin.cn',
    password: 'admin',
  });

  const userInfo = reactive({
    email: loginConfig.value.email,
    password: loginConfig.value.password,
  });

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
        await userStore.login(values as LoginData);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        await router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
        const { rememberPassword } = loginConfig.value;
        const { email, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.email = rememberPassword ? email : '';
        loginConfig.value.password = rememberPassword ? password : '';
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