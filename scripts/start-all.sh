#!/bin/bash

# 项目一键启动脚本
# 自动检查端口、清理冲突、启动所有服务

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== 幸福力项目启动工具 ===${NC}\n"

# 1. 检查端口占用
echo -e "${YELLOW}步骤 1/4: 检查端口占用...${NC}"
./scripts/port-check.sh check

# 2. 询问是否清理
echo -e "\n${YELLOW}发现端口被占用，是否清理？(y/n)${NC}"
read -p "> " answer

if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    echo -e "\n${YELLOW}步骤 2/4: 清理占用的端口...${NC}"
    ./scripts/port-check.sh kill
else
    echo -e "${RED}已取消启动${NC}"
    exit 1
fi

# 3. 启动后端服务
echo -e "\n${YELLOW}步骤 3/4: 启动后端服务...${NC}"
cd backend
npm run start:dev > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✓ 后端服务已启动 (PID: $BACKEND_PID)${NC}"

sleep 5

# 4. 启动前端服务
echo -e "\n${YELLOW}步骤 4/4: 启动前端服务...${NC}"

# 启动前台H5
cd frontend-h5
npm run dev > /dev/null 2>&1 &
H5_PID=$!
cd ..
echo -e "${GREEN}✓ 前台H5已启动 (PID: $H5_PID)${NC}"

# 启动后台管理
cd frontend-admin
npm run dev > /dev/null 2>&1 &
ADMIN_PID=$!
cd ..
echo -e "${GREEN}✓ 后台管理已启动 (PID: $ADMIN_PID)${NC}"

sleep 3

# 5. 验证启动
echo -e "\n${BLUE}=== 启动完成 ===${NC}"
echo ""
./scripts/port-check.sh check

echo -e "\n${GREEN}访问地址:${NC}"
echo -e "  后端API:    ${BLUE}http://localhost:3000/api/v1${NC}"
echo -e "  前台H5:     ${BLUE}http://localhost:5173${NC}"
echo -e "  后台管理:   ${BLUE}http://localhost:5175${NC}"
echo ""
echo -e "${YELLOW}提示: 按 Ctrl+C 退出后，记得使用以下命令清理进程:${NC}"
echo -e "  ${BLUE}./scripts/port-check.sh kill${NC}"

