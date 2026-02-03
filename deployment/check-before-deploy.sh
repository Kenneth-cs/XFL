#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 计数器
PASS=0
FAIL=0
WARN=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   幸福力项目部署前配置检查${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 检查函数
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    echo -e "  ${YELLOW}解决方案: $2${NC}"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

# 1. 检查前端配置文件
echo -e "${BLUE}[1/6] 检查前端Vite配置${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查 H5 vite.config.ts
if [ -f "frontend-h5/vite.config.ts" ]; then
    if grep -q "base: '/h5/'" frontend-h5/vite.config.ts; then
        check_pass "H5前端配置了正确的base路径: '/h5/'"
    else
        check_fail "H5前端缺少base路径配置" "在 frontend-h5/vite.config.ts 中添加: base: '/h5/'"
    fi
else
    check_fail "找不到 frontend-h5/vite.config.ts" "请检查项目结构"
fi

# 检查 Admin vite.config.ts
if [ -f "frontend-admin/vite.config.ts" ]; then
    if grep -q "base: '/admin/'" frontend-admin/vite.config.ts; then
        check_pass "Admin前端配置了正确的base路径: '/admin/'"
    else
        check_fail "Admin前端缺少base路径配置" "在 frontend-admin/vite.config.ts 中添加: base: '/admin/'"
    fi
else
    check_fail "找不到 frontend-admin/vite.config.ts" "请检查项目结构"
fi

echo ""

# 2. 检查前端构建产物
echo -e "${BLUE}[2/6] 检查前端构建产物${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "frontend-h5/dist" ]; then
    if [ -f "frontend-h5/dist/index.html" ]; then
        if grep -q '/h5/assets/' frontend-h5/dist/index.html; then
            check_pass "H5构建产物路径正确 (/h5/assets/)"
        else
            check_fail "H5构建产物路径不正确" "请重新构建: cd frontend-h5 && npx vite build"
        fi
    else
        check_warn "H5未构建或index.html不存在"
    fi
else
    check_warn "H5尚未构建 (dist目录不存在)"
fi

if [ -d "frontend-admin/dist" ]; then
    if [ -f "frontend-admin/dist/index.html" ]; then
        if grep -q '/admin/assets/' frontend-admin/dist/index.html; then
            check_pass "Admin构建产物路径正确 (/admin/assets/)"
        else
            check_fail "Admin构建产物路径不正确" "请重新构建: cd frontend-admin && npx vite build"
        fi
    else
        check_warn "Admin未构建或index.html不存在"
    fi
else
    check_warn "Admin尚未构建 (dist目录不存在)"
fi

echo ""

# 3. 检查后端配置
echo -e "${BLUE}[3/6] 检查后端配置${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "backend/.env" ]; then
    check_pass "后端环境变量文件存在"
    
    # 检查必要的配置项
    if grep -q "DB_HOST=" backend/.env; then
        check_pass "数据库主机配置存在"
    else
        check_fail "缺少数据库主机配置" "在 backend/.env 中添加: DB_HOST=localhost"
    fi
    
    if grep -q "DB_PASSWORD=" backend/.env; then
        check_pass "数据库密码配置存在"
    else
        check_warn "数据库密码配置可能缺失"
    fi
    
    if grep -q "JWT_SECRET=" backend/.env; then
        JWT_SECRET=$(grep "JWT_SECRET=" backend/.env | cut -d '=' -f2)
        if [ ${#JWT_SECRET} -ge 32 ]; then
            check_pass "JWT密钥长度足够 (>= 32字符)"
        else
            check_warn "JWT密钥长度较短，建议至少32字符"
        fi
    else
        check_fail "缺少JWT密钥配置" "在 backend/.env 中添加: JWT_SECRET=your_secret_key"
    fi
    
    if grep -q "PORT=3001" backend/.env; then
        check_pass "后端端口配置正确 (3001)"
    else
        check_warn "后端端口配置可能不是3001"
    fi
else
    check_fail "后端环境变量文件不存在" "从 backend/.env.example 复制并修改"
fi

echo ""

# 4. 检查后端构建产物
echo -e "${BLUE}[4/6] 检查后端构建产物${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "backend/dist" ]; then
    if [ -f "backend/dist/main.js" ]; then
        check_pass "后端构建产物存在 (dist/main.js)"
    else
        check_fail "后端构建产物不完整" "请重新构建: cd backend && npm run build"
    fi
else
    check_warn "后端尚未构建 (dist目录不存在)"
fi

if [ -f "backend/package.json" ]; then
    check_pass "后端package.json存在"
else
    check_fail "找不到backend/package.json" "请检查项目结构"
fi

echo ""

# 5. 检查PM2配置
echo -e "${BLUE}[5/6] 检查PM2配置${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "backend/pm2.config.js" ]; then
    check_pass "PM2配置文件存在"
    
    if grep -q "./dist/main.js" backend/pm2.config.js; then
        check_pass "PM2启动脚本路径正确"
    else
        check_warn "PM2启动脚本路径可能不正确"
    fi
else
    check_warn "PM2配置文件不存在，将使用默认配置"
fi

echo ""

# 6. 检查依赖安装
echo -e "${BLUE}[6/6] 检查依赖安装${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "frontend-h5/node_modules" ]; then
    check_pass "H5前端依赖已安装"
else
    check_warn "H5前端依赖未安装，请运行: cd frontend-h5 && npm install"
fi

if [ -d "frontend-admin/node_modules" ]; then
    check_pass "Admin前端依赖已安装"
else
    check_warn "Admin前端依赖未安装，请运行: cd frontend-admin && npm install"
fi

if [ -d "backend/node_modules" ]; then
    check_pass "后端依赖已安装"
else
    check_warn "后端依赖未安装，请运行: cd backend && npm install"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   检查结果汇总${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}通过: $PASS${NC}"
echo -e "  ${YELLOW}警告: $WARN${NC}"
echo -e "  ${RED}失败: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    if [ $WARN -eq 0 ]; then
        echo -e "${GREEN}✓ 所有检查通过！可以开始部署。${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠ 检查通过，但有 $WARN 个警告项需要注意。${NC}"
        exit 0
    fi
else
    echo -e "${RED}✗ 发现 $FAIL 个错误，请修复后再部署。${NC}"
    exit 1
fi
