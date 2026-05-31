import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorators';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}

  // example: GET /products/:id
  @Get(':id')
  async getProductById(@Param('id') id: string){
    const data = await this.productsService.getProductById(id);
    return data;
  }


  @ResponseMessage('All products fetched successfully')
  @Get()
  async getAllProducts(){
    return this.productsService.getAllProducts();
  }

  @Patch(':id')
  async updateProduct(@Param('id', ParseUUIDPipe) id: string,
  @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.updateProductById(id, updateProductDto);
  }
}


