export const RedisCacheKey = {
  PRODUCT: (id: string) => `product:${id}`,
  FLASH_SALE_PRODUCT: (id: string) => `flash-sale:product:${id}`,
  USER_PROFILE: (id: string) => `user:profile:${id}`,
  REFRESH_TOKEN: (userId: string) => `refresh:${userId}`,
} as const;


