/**
 * 手机号相关工具函数
 */

/**
 * 脱敏手机号
 * @param phone 原始手机号 (如: 13812345678)
 * @returns 脱敏后的手机号 (如: 138****5678)
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone || phone.length !== 11) {
    return phone || '';
  }
  
  // 保留前3位和后4位，中间4位用 **** 替换
  return phone.substring(0, 3) + '****' + phone.substring(7);
}

/**
 * 批量脱敏用户列表中的手机号
 * @param users 用户列表
 * @param shouldMask 是否需要脱敏
 * @returns 处理后的用户列表
 */
export function maskUsersPhone<T extends { phone?: string; profile?: any }>(
  users: T[],
  shouldMask: boolean
): T[] {
  if (!shouldMask) {
    return users;
  }

  return users.map(user => {
    // 使用 Object.assign 而不是展开运算符，确保保留所有属性（包括关系）
    const masked = Object.assign({}, user, {
      phone: user.phone ? maskPhone(user.phone) : user.phone
    });
    // 显式保留 profile 关系
    if (user.profile) {
      masked.profile = user.profile;
    }
    return masked;
  }) as T[];
}

