<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">幸福力后台</div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <user-outlined />
          <span>工作台</span>
        </a-menu-item>
        <a-menu-item key="2">
          <team-outlined />
          <span>用户档案管理</span>
        </a-menu-item>
        <a-menu-item key="3" v-if="isAdmin">
          <shop-outlined />
          <span>门店管理</span>
        </a-menu-item>
        <a-menu-item key="4" v-if="isSuperAdmin">
          <setting-outlined />
          <span>系统管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 16px; display: flex; justify-content: flex-end;">
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            {{ userInfo?.username || '管理员' }}
            <down-outlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;" @click="logout">退出登录</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content style="margin: 16px">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <h2>欢迎回来，{{ userInfo?.role }}</h2>
          <p>这里是后台管理系统的基础框架。</p>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        幸福力婚恋系统 ©2026 Created by AI Assistant
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  UserOutlined,
  TeamOutlined,
  ShopOutlined,
  SettingOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';

const collapsed = ref(false);
const selectedKeys = ref(['1']);
const router = useRouter();

const userInfo = JSON.parse(localStorage.getItem('admin_user') || '{}');

const isSuperAdmin = computed(() => userInfo.role === 'super_admin');
const isAdmin = computed(() => userInfo.role === 'admin' || isSuperAdmin.value);

const logout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  router.push('/login');
};
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
  text-align: center;
  line-height: 32px;
  color: white;
  font-weight: bold;
}
</style>
