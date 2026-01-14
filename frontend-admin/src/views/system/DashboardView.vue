<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible width="220">
      <div class="logo">幸福力后台</div>
      <a-menu 
        v-model:selectedKeys="selectedKeys" 
        v-model:openKeys="openKeys"
        theme="dark" 
        mode="inline"
        @click="handleMenuClick"
      >
        <!-- 后台人员管理 -->
        <a-sub-menu key="staff" v-if="canManageStaff">
          <template #icon><team-outlined /></template>
          <template #title>后台人员管理</template>
          <a-menu-item key="/staff/approval">人员审核</a-menu-item>
          <a-menu-item key="/staff/list">人员列表</a-menu-item>
        </a-sub-menu>

        <!-- 角色&门店管理 -->
        <a-sub-menu key="system">
          <template #icon><setting-outlined /></template>
          <template #title>角色&门店管理</template>
          <a-menu-item key="/system/roles">角色列表</a-menu-item>
          <a-menu-item key="/system/stores" v-if="isSuperAdmin">门店列表</a-menu-item>
        </a-sub-menu>

        <!-- 用户档案管理 -->
        <a-sub-menu key="members">
          <template #icon><user-outlined /></template>
          <template #title>用户档案管理</template>
          <a-menu-item key="/members/list">用户列表</a-menu-item>
          <a-menu-item key="/members/match" v-if="canMatch">智能匹配</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 16px; display: flex; justify-content: space-between; align-items: center;">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>{{ currentModule }}</a-breadcrumb-item>
          <a-breadcrumb-item v-if="currentPage">{{ currentPage }}</a-breadcrumb-item>
        </a-breadcrumb>
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
        <div :style="{ padding: '24px', background: '#fff', minHeight: '85vh' }">
          <router-view />
        </div>
      </a-layout-content>
      
      <a-layout-footer style="text-align: center; padding: 12px 50px">
        幸福力婚恋系统 ©2026
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';

const collapsed = ref(false);
const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>(['staff', 'system', 'members']);
const router = useRouter();
const route = useRoute();

const userInfo = JSON.parse(localStorage.getItem('admin_user') || '{}');

// 权限计算
const isSuperAdmin = computed(() => userInfo.role === 'super_admin');
const isAdmin = computed(() => userInfo.role === 'admin' || isSuperAdmin.value);
const isManager = computed(() => userInfo.role === 'manager' || isAdmin.value);

// 菜单权限
const canManageStaff = computed(() => isAdmin.value); // 只有超管和老板能管理后台人员
const canMatch = computed(() => isManager.value); // 经理及以上能发起匹配

// 面包屑导航
const currentModule = computed(() => {
  const path = route.path;
  if (path.startsWith('/staff')) return '后台人员管理';
  if (path.startsWith('/system')) return '角色&门店管理';
  if (path.startsWith('/members')) return '用户档案管理';
  return '工作台';
});

const currentPage = computed(() => {
  const path = route.path;
  if (path === '/staff/approval') return '人员审核';
  if (path === '/staff/list') return '人员列表';
  if (path === '/system/roles') return '角色列表';
  if (path === '/system/stores') return '门店列表';
  if (path === '/members/list') return '用户列表';
  if (path === '/members/match') return '智能匹配';
  return '';
});

// 监听路由变化，更新选中菜单
watch(() => route.path, (newPath) => {
  selectedKeys.value = [newPath];
}, { immediate: true });

// 菜单点击事件
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key);
};

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
