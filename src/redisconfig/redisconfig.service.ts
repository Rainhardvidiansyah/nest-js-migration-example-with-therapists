import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisConfigService {

  private logger = new Logger(RedisConfigService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache){
    console.log('=== Cache store:', (cacheManager as any).store);
    console.log('=== Full cacheManager:', JSON.stringify(cacheManager));
  }


  //DELETE
  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.log(`Key - ${key} has been deleted`);
    } catch (error) {
      this.logger.error(`Fail to delete cache key: ${key}`, error);
    }
  }


  //GET
  async get<T>(key: string): Promise<T | null> {

    try {
      const timeOut = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 1000);
      });

    console.log('=== Redis GET:', key);

    const data = await Promise.race([
      this.cacheManager.get<T>(key),
      timeOut
    ]);
    //await this.cacheManager.get<T>(key);

    console.log('=== Redis GET result:', data);

    return data ?? null;

  } catch (error) {
    this.logger.error(`Fail to get cache for key: ${key}`, error);
    return null;
  }
}


//SET
async set(key: string, value: any, ttlInMinutes: number): Promise<void> {

  try {
    console.log('=== Redis SET:', key);

    const timeOut = new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1000)
    });

    await Promise.race([
      this.cacheManager.set(key, value, ttlInMinutes * 60 * 1000 * 1000), timeOut
    ])



    // await this.cacheManager.set(key, value, ttlInMinutes * 60 * 1000 * 1000);
    console.log('=== Redis SET success');

  } catch (error) {
    this.logger.error(`Fail to save cache for key: ${key}`, error);
  }
}

}
