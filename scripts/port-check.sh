#!/bin/bash

# 端口管理脚本
# 用途: 检查和清理端口占用

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目端口配置
BACKEND_PORT=3000
FRONTEND_H5_PORT=5173
FRONTEND_ADMIN_PORT=5175

echo -e "${BLUE}=== 幸福力项目端口检查工具 ===${NC}\n"

# 函数: 检查单个端口
check_port() {
    local port=$1
    local name=$2
    
    echo -e "${YELLOW}检查 $name (端口 $port)...${NC}"
    
    local pid=$(lsof -ti:$port 2>/dev/null)
    
    if [ -z "$pid" ]; then
        echo -e "${GREEN}✓ 端口 $port 空闲${NC}\n"
        return 0
    else
        echo -e "${RED}✗ 端口 $port 被占用${NC}"
        lsof -i :$port
        echo ""
        return 1
    fi
}

# 函数: 清理单个端口
kill_port() {
    local port=$1
    local name=$2
    
    echo -e "${YELLOW}清理 $name (端口 $port)...${NC}"
    
    local pid=$(lsof -ti:$port 2>/dev/null)
    
    if [ -z "$pid" ]; then
        echo -e "${GREEN}端口 $port 已经是空闲状态${NC}\n"
    else
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 1
        
        if lsof -ti:$port >/dev/null 2>&1; then
            echo -e "${RED}清理失败${NC}\n"
        else
            echo -e "${GREEN}✓ 端口 $port 已清理${NC}\n"
        fi
    fi
}

# 主菜单
case "$1" in
    check)
        echo "=== 检查所有端口 ==="
        check_port $BACKEND_PORT "后端服务"
        check_port $FRONTEND_H5_PORT "前台H5"
        check_port $FRONTEND_ADMIN_PORT "后台管理"
        ;;
    
    kill)
        if [ -n "$2" ]; then
            # 清理指定端口
            kill_port $2 "指定端口"
        else
            # 清理所有项目端口
            echo "=== 清理所有端口 ==="
            kill_port $BACKEND_PORT "后端服务"
            kill_port $FRONTEND_H5_PORT "前台H5"
            kill_port $FRONTEND_ADMIN_PORT "后台管理"
            
            # 额外清理nest和vite进程
            echo -e "${YELLOW}清理残留进程...${NC}"
            pkill -f "nest start" 2>/dev/null
            pkill -f "vite" 2>/dev/null
            echo -e "${GREEN}✓ 清理完成${NC}\n"
        fi
        ;;
    
    backend)
        check_port $BACKEND_PORT "后端服务"
        ;;
    
    frontend)
        check_port $FRONTEND_H5_PORT "前台H5"
        check_port $FRONTEND_ADMIN_PORT "后台管理"
        ;;
    
    *)
        echo "用法:"
        echo "  $0 check           - 检查所有端口"
        echo "  $0 kill            - 清理所有端口"
        echo "  $0 kill [端口号]   - 清理指定端口"
        echo "  $0 backend         - 检查后端端口"
        echo "  $0 frontend        - 检查前端端口"
        echo ""
        echo "示例:"
        echo "  $0 check           # 检查端口占用"
        echo "  $0 kill            # 清理所有"
        echo "  $0 kill 3000       # 只清理3000端口"
        exit 1
        ;;
esac

