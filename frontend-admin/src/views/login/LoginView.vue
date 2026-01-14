<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">幸福力婚恋系统 · 后台管理</h2>
      <a-form
        :model="formState"
        name="basic"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        autocomplete="off"
        layout="vertical"
      >
        <a-form-item
          label="账号"
          name="username"
          :rules="[{ required: true, message: '请输入账号!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="loading">登录</a-button>
        </a-form-item>
        
        <div class="actions">
          <a @click="showRegisterModal">注册新账号</a>
        </div>
      </a-form>
    </div>

    <!-- 注册弹窗 -->
    <a-modal v-model:open="registerVisible" title="后台人员注册" @ok="handleRegister" :confirmLoading="registerLoading">
      <a-form layout="vertical">
        <a-form-item label="用户名 (登录账号)">
          <a-input v-model:value="registerForm.username" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password v-model:value="registerForm.password" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model:value="registerForm.name" /> <!-- 暂时映射到 username 或其他字段 -->
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="registerForm.phone" />
        </a-form-item>
        <a-form-item label="所属门店ID">
          <a-input v-model:value="registerForm.storeId" placeholder="例如: XFL001" />
        </a-form-item>
        <a-form-item label="申请角色">
          <a-select v-model:value="registerForm.role">
            <a-select-option value="matchmaker">普通红娘</a-select-option>
            <a-select-option value="manager">门店负责人</a-select-option>
            <a-select-option value="admin">门店老板</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const loading = ref(false);
const registerVisible = ref(false);
const registerLoading = ref(false);

const formState = reactive({
  username: '',
  password: '',
});

const registerForm = reactive({
  username: '',
  password: '',
  name: '',
  phone: '',
  storeId: '',
  role: 'matchmaker'
});

const onFinish = async (values: any) => {
  loading.value = true;
  try {
    // 调用后端登录接口
    const res = await axios.post('/api/v1/auth/login/sys', values);
    localStorage.setItem('admin_token', res.data.accessToken);
    localStorage.setItem('admin_user', JSON.stringify(res.data.user));
    message.success('登录成功');
    router.push('/');
  } catch (error: any) {
    message.error(error.response?.data?.message || '登录失败');
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const showRegisterModal = () => {
  registerVisible.value = true;
};

const handleRegister = async () => {
  registerLoading.value = true;
  try {
    await axios.post('/api/v1/users/register/sys', registerForm);
    message.success('注册申请已提交，请等待审核');
    registerVisible.value = false;
  } catch (error: any) {
    message.error(error.response?.data?.message || '注册失败');
  } finally {
    registerLoading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
}

.login-card {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #1f1f1f;
  font-size: 24px;
}

.actions {
  text-align: center;
  margin-top: 16px;
}
</style>
