import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { RedisConfigService } from 'src/redisconfig/redisconfig.service';
import { RedisCacheKey } from 'src/common/constants/redis-cache-key.constant';
import { RedisTTL } from 'src/common/constants/redis-ttl.constants';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {

  private logger = new Logger(ProductsService.name);

  constructor(
    private readonly redisService: RedisConfigService,
    @Inject('PRODUCT_REPOSITORY') private readonly productRepository: Repository<ProductsEntity>
  ){}


  //GET PRODUCT BY ID
  async getProductById(id: string){

    const productCacheKey = RedisCacheKey.PRODUCT(id);

    this.logger.log(`Cache key: ${productCacheKey}`);

    const cachedProduct = await this.redisService.get<any>(productCacheKey);

    if (cachedProduct) {

      return {
        source: 'Redis Cache',
        data: cachedProduct,
      };
    }
    const product = await this.productRepository.findOne({ where: { id } });

    
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const productData = {
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
    }

    await this.redisService.set(productCacheKey, productData, RedisTTL.PRODUCT);
    
    
    return productData;
  }
  
  
  //GET ALL PRODUCT
  async getAllProducts(): Promise<ProductsEntity[]>{

    return this.productRepository.find();
  }


  
  //UPDATE PRODUCT BY ID
  async updateProductById(id: string, updateProductDto: UpdateProductDto): Promise<ProductsEntity>{

    const productToUpdate = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    })
    
    if(!productToUpdate){
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    const updatedProduct = await this.productRepository.save(productToUpdate);

    await this.redisService.delete(RedisCacheKey.PRODUCT(id));

    return updatedProduct;
  }


  //DELETE PRODUCT BY ID
  async deleteProductById(id: string): Promise<void>{

    const productId = await this.productRepository.findOneBy({id});

    if(!productId){
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    await this.redisService.delete(RedisCacheKey.PRODUCT(productId.id));

    await this.productRepository.remove(productId);
  }

}
