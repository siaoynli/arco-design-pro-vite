<template>
  <div class="login-form-title">{{ $t('login.form.title') }}</div>
  <div class="login-form-sub-title">{{ $t('login.form.subtitle') }}</div>
  <a-form
    ref="loginForm"
    :model="userInfo"
    class="login-form"
    layout="vertical"
    size="large"
    @submit="handleSubmit"
  >
    <a-form-item
      field="phone"
      :rules="[
        {
          type: 'number',
          required: true,
          message: '请输入手机号码',
        },
        {
          match: /^1[345789]\d{9}$/,
          message: '手机号码格式不正确',
        },
      ]"
      :validate-trigger="['change', 'blur']"
      hide-label
    >
      <a-input v-model="userInfo.phone" placeholder="手机号码">
        <template #prefix>
          <icon-phone />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      field="code"
      :rules="[
        { required: true, message: '请输入验证码' },
        {
          match: /\d{6}$/,
          message: '验证码格式不正确',
        },
      ]"
      :validate-trigger="['change', 'blur']"
      hide-label
    >
      <a-space>
        <a-input v-model="userInfo.code" placeholder="验证码" :max-length="6">
          <template #prefix>
            <icon-code />
          </template>
        </a-input>
        <a-button
          type="primary"
          :loading="cLoading"
          style="width: 130px"
          :disabled="disabled"
          @click="handleSendCode"
        >
          <template v-if="refTime"> {{ refTime }} 秒</template>

          <template v-else> 发送验证码</template>
        </a-button>
      </a-space>
    </a-form-item>

    <a-space :size="16" direction="vertical">
      <a-button type="primary" html-type="submit" long :loading="loading">
        {{ $t('login.form.login') }}
      </a-button>
    </a-space>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';

  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';
  import { getPhoneCode } from '@/api/user';

  const router = useRouter();

  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const cLoading = ref<boolean>(false);

  const refTime = ref<number>(0);

  // 存储到storage里
  const loginConfig = useStorage('login-code-config', {
    phone: '18906715574',
  });

  const regExp = /^1[345789]\d{9}$/;

  const userInfo = reactive({
    phone: loginConfig.value.phone,
    code: '',
    key: '',
    loginType: 'code',
  });

  const disabled = ref<boolean>(!regExp.test(userInfo.phone));
  // 监听用户手机号码
  watch(
    () => userInfo.phone,
    (newValue) => {
      if (newValue && regExp.test(newValue)) {
        disabled.value = false;
      } else {
        disabled.value = true;
      }
    }
  );

  // 监听秒数
  watch(
    () => refTime.value,
    (newValue) => {
      disabled.value = !!newValue;
    }
  );

  const handleSendCode = async () => {
    cLoading.value = true;
    refTime.value = 60;
    // 倒计时秒数
    const timer = setInterval(() => {
      if (refTime.value <= 0) {
        clearInterval(timer);
      } else {
        refTime.value -= 1;
      }
    }, 1000);

    try {
      // 验证码登陆
      const result = await getPhoneCode(userInfo.phone);
      userInfo.key = result.data.key;
      Message.success('发送成功,验证码有效时间10分钟');
    } finally {
      cLoading.value = false;
    }
  };

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
        Message.success('登陆成功，欢迎使用!');
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        await router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
      } finally {
        setLoading(false);
      }
    }
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
