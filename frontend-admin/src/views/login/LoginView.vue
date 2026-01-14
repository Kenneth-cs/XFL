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
    <a-modal 
      v-model:open="registerVisible" 
      title="后台人员注册" 
      @ok="handleRegister" 
      :confirmLoading="registerLoading"
      width="600px"
    >
      <a-form layout="vertical">
        <a-form-item label="用户名 (登录账号)" :required="true">
          <a-input v-model:value="registerForm.username" placeholder="3-20个字符" />
        </a-form-item>
        <a-form-item label="密码" :required="true">
          <a-input-password v-model:value="registerForm.password" placeholder="6-20个字符" />
        </a-form-item>
        <a-form-item label="真实姓名" :required="true">
          <a-input v-model:value="registerForm.name" placeholder="请输入真实姓名" />
        </a-form-item>
        <a-form-item label="身份证号" :required="true">
          <a-input v-model:value="registerForm.idCard" placeholder="请输入18位身份证号" />
        </a-form-item>
        <a-form-item label="手机号" :required="true">
          <a-input v-model:value="registerForm.phone" placeholder="请输入11位手机号" />
        </a-form-item>
        <a-form-item label="所属门店" :required="true">
          <a-select 
            v-model:value="registerForm.storeId" 
            placeholder="请选择所属门店"
            :loading="storesLoading"
            @focus="fetchStores"
          >
            <a-select-option 
              v-for="store in stores" 
              :key="store.id" 
              :value="store.id"
            >
              {{ store.name }} ({{ store.id }})
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="申请角色" :required="true">
          <a-select v-model:value="registerForm.role" placeholder="请选择申请角色">
            <a-select-option value="matchmaker">普通红娘</a-select-option>
            <a-select-option value="manager">门店负责人</a-select-option>
            <a-select-option value="admin">门店老板</a-select-option>
            <!-- 超级管理员不允许注册，仅系统预设 -->
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="registerForm.agreeToTerms">
            我已阅读并同意 <a @click.prevent="showTerms">《婚恋服务机构员工保密协议》</a>
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 用户协议弹窗 -->
    <a-modal 
      v-model:open="termsVisible" 
      title="婚恋服务机构员工保密协议" 
      :footer="null"
      width="800px"
      :bodyStyle="{ maxHeight: '500px', overflowY: 'auto' }"
    >
      <div class="terms-content" v-html="termsHtml"></div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const loading = ref(false);
const registerVisible = ref(false);
const registerLoading = ref(false);
const termsVisible = ref(false);
const storesLoading = ref(false);

interface Store {
  id: string;
  name: string;
  status: number;
}

const stores = ref<Store[]>([]);

const formState = reactive({
  username: '',
  password: '',
});

const registerForm = reactive({
  username: '',
  password: '',
  name: '',
  idCard: '',
  phone: '',
  storeId: '',
  role: 'matchmaker',
  agreeToTerms: false
});

const termsHtml = `
  <h3 style="text-align: center; font-weight: bold;">婚恋服务机构员工保密协议</h3>
  <p><strong>甲方（用人单位）：</strong>________________________________ （以下简称"门店"）</p>
  <p><strong>乙方（劳动者）：</strong>__________________</p>
  
  <h4>一、保密信息的定义及范围</h4>
  <p>本协议所称"保密信息"，是指乙方在为甲方工作期间，因履行工作职责或因甲方业务需要而知悉的所有与甲方客户相关的信息及甲方的商业秘密。具体范围包括但不限于：</p>
  <ul>
    <li>客户个人基础信息：客户的姓名、性别、年龄、身份证号码、联系方式、家庭住址、婚姻状况、家庭成员信息、职业信息、收入状况、教育背景等；</li>
    <li>客户婚恋服务相关信息：客户的婚恋需求、服务合同内容、服务进程记录、与客户的沟通记录、为客户匹配的婚恋对象信息等；</li>
    <li>甲方的商业秘密：包括但不限于门店的客户资源库、服务流程、收费标准、营销方案、管理制度、财务信息等；</li>
  </ul>
  
  <h4>二、保密义务</h4>
  <p>乙方承诺，在为甲方工作期间及与甲方终止劳动关系后，严格履行以下保密义务：</p>
  <ul>
    <li>不得擅自收集、记录、复制、存储、携带保密信息离开甲方工作场所，除非经甲方书面授权并用于履行工作职责；</li>
    <li>不得向任何第三方泄露、披露、传播保密信息；</li>
    <li>不得利用保密信息为自己或第三方谋取利益；</li>
    <li>不得倒卖、有偿转让或变相转让保密信息；</li>
  </ul>
  
  <h4>三、保密期限</h4>
  <p>本协议约定的保密期限为自乙方知悉保密信息之日起至该保密信息完全公开且无保密必要之日止，<strong>最低保密年限不低于5年</strong>。即使乙方与甲方解除或终止劳动关系，本保密义务仍然有效。</p>
  
  <h4>四、同行竞业限制</h4>
  <p>乙方承诺，在其与甲方存在劳动关系期间以及与甲方解除或终止劳动关系后<strong>2年内</strong>，不得在与甲方经营同类业务、存在竞争关系的单位任职、兼职。</p>
  
  <h4>五、违约责任</h4>
  <p>若乙方违反本保密协议，乙方需无条件直接支付给甲方违约金<strong>人民币50万元</strong>；若违约金不足以弥补甲方实际损失，乙方还应赔偿甲方的差额部分损失。</p>
  
  <h4>六、法律责任</h4>
  <p>若乙方违反本协议约定的义务，涉嫌违法犯罪的，甲方有权向司法机关报案，追究乙方的刑事责任。</p>
  
  <p style="margin-top: 20px; color: #666;">本协议自双方签字或盖章之日起生效。</p>
`;

const onFinish = async (values: any) => {
  loading.value = true;
  try {
    // 调用后端登录接口（axios 拦截器已返回 response.data）
    const res = await axios.post('/auth/login/sys', values);
    console.log('登录响应数据:', res);
    
    // 直接访问 res（因为拦截器已经解包）
    localStorage.setItem('admin_token', res.accessToken);
    localStorage.setItem('admin_user', JSON.stringify(res.user));
    message.success('登录成功');
    router.push('/');
  } catch (error: any) {
    console.error('登录错误:', error);
    message.error(error.response?.data?.message || '登录失败');
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

// 获取门店列表（仅获取状态为正常的门店）
const fetchStores = async () => {
  // 如果已经加载过，就不再重复加载
  if (stores.value.length > 0) return;
  
  storesLoading.value = true;
  try {
    const res = await axios.get('/stores', {
      params: { status: 1 } // 只获取启用状态的门店
    });
    stores.value = (res.data || res || []).filter((store: Store) => store.status === 1);
  } catch (error: any) {
    console.error('加载门店列表失败:', error);
    message.error('加载门店列表失败');
  } finally {
    storesLoading.value = false;
  }
};

const showRegisterModal = () => {
  // 重置表单
  Object.assign(registerForm, {
    username: '',
    password: '',
    name: '',
    idCard: '',
    phone: '',
    storeId: '',
    role: 'matchmaker',
    agreeToTerms: false
  });
  registerVisible.value = true;
  // 打开注册弹窗时加载门店列表
  fetchStores();
};

const showTerms = () => {
  termsVisible.value = true;
};

// 组件挂载时预加载门店列表
onMounted(() => {
  fetchStores();
});

const handleRegister = async () => {
  // 表单验证
  if (!registerForm.username || registerForm.username.length < 3 || registerForm.username.length > 20) {
    message.error('用户名长度为 3-20 个字符');
    return;
  }
  if (!registerForm.password || registerForm.password.length < 6 || registerForm.password.length > 20) {
    message.error('密码长度为 6-20 个字符');
    return;
  }
  if (!registerForm.name || registerForm.name.length < 2 || registerForm.name.length > 20) {
    message.error('姓名长度为 2-20 个字符');
    return;
  }
  if (!registerForm.idCard || !/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(registerForm.idCard)) {
    message.error('身份证号格式不正确');
    return;
  }
  if (!registerForm.phone || !/^1[3-9]\d{9}$/.test(registerForm.phone)) {
    message.error('手机号格式不正确');
    return;
  }
  if (!registerForm.storeId) {
    message.error('请选择所属门店');
    return;
  }
  if (!registerForm.role) {
    message.error('请选择申请角色');
    return;
  }
  if (!registerForm.agreeToTerms) {
    message.error('请阅读并同意用户协议');
    return;
  }

  registerLoading.value = true;
  try {
    await axios.post('/users/register/sys', registerForm);
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

.terms-content {
  line-height: 1.8;
  font-size: 14px;
  color: #333;
}

.terms-content h3 {
  font-size: 18px;
  margin-bottom: 16px;
}

.terms-content h4 {
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #1890ff;
}

.terms-content p {
  margin-bottom: 12px;
}

.terms-content ul {
  margin-left: 20px;
  margin-bottom: 12px;
}

.terms-content li {
  margin-bottom: 8px;
}
</style>
