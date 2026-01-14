<template>
  <div class="roles-list">
    <a-page-header
      title="角色列表"
      sub-title="查看系统角色及权限说明"
    />

    <a-row :gutter="[16, 16]">
      <a-col :span="12" v-for="role in roles" :key="role.code">
        <a-card :title="role.name" :bordered="false">
          <template #extra>
            <a-tag :color="role.color">{{ role.level }}</a-tag>
          </template>
          <p><strong>权限范围：</strong>{{ role.scope }}</p>
          <a-divider />
          <p><strong>核心权限：</strong></p>
          <ul>
            <li v-for="(perm, index) in role.permissions" :key="index">{{ perm }}</li>
          </ul>
          <a-divider />
          <p><strong>关键限制：</strong></p>
          <a-tag color="orange">{{ role.limitation }}</a-tag>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const roles = ref([
  {
    code: 'super_admin',
    name: '超级管理员',
    level: '⭐⭐⭐⭐⭐',
    color: 'red',
    scope: '全局数据视野',
    permissions: [
      '管理所有门店（新增/禁用/编辑）',
      '审核所有后台人员注册',
      '分配任意角色权限',
      '重置所有用户密码',
      '查看跨门店数据'
    ],
    limitation: '仅总部人员持有，不绑定具体门店'
  },
  {
    code: 'admin',
    name: '门店老板',
    level: '⭐⭐⭐⭐',
    color: 'purple',
    scope: '门店私有视野',
    permissions: [
      '审核本门店人员注册',
      '管理本门店人员账号（禁用/启用）',
      '分配角色（除老板外）',
      '查看本门店所有数据',
      '管理本门店所有会员'
    ],
    limitation: '仅限本门店范围'
  },
  {
    code: 'manager',
    name: '门店负责人',
    level: '⭐⭐⭐',
    color: 'cyan',
    scope: '门店私有视野',
    permissions: [
      '查看本门店人员列表',
      '分配服务红娘',
      '查看本门店所有会员',
      '发起智能匹配',
      '记录服务轨迹'
    ],
    limitation: '不能管理后台人员账号'
  },
  {
    code: 'matchmaker',
    name: '普通红娘',
    level: '⭐⭐',
    color: 'blue',
    scope: '仅服务会员',
    permissions: [
      '查看自己服务的会员档案',
      '编辑自己服务的会员资料',
      '为自己的会员发起匹配',
      '记录服务轨迹'
    ],
    limitation: '手机号脱敏，仅能操作自己服务的会员'
  }
]);
</script>

<style scoped>
.roles-list {
  background: #fff;
  padding: 24px;
  min-height: 100%;
}

.roles-list ul {
  margin: 0;
  padding-left: 20px;
}

.roles-list li {
  margin: 4px 0;
}
</style>

