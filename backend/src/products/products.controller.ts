// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
// } from '@nestjs/common';

// import { ProductsService } from './products.service';

// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
// import { ProductQueryDto } from './dto/product-query.dto';

// @Controller('products')
// export class ProductsController {
//   constructor(
//     private readonly productsService: ProductsService,
//   ) {}

//   @Post()
//   create(
//     @Body() dto: CreateProductDto,
//   ) {
//     return this.productsService.create(
//       dto,
//     );
//   }

//   @Get()
//   findAll(
//     @Query() query: ProductQueryDto,
//   ) {
//     return this.productsService.findAll(
//       query,
//     );
//   }

//   @Get(':id')
//   findById(
//     @Param('id') id: string,
//   ) {
//     return this.productsService.findById(
//       id,
//     );
//   }

//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() dto: UpdateProductDto,
//   ) {
//     return this.productsService.update(
//       id,
//       dto,
//     );
//   }

//   @Delete(':id')
//   remove(
//     @Param('id') id: string,
//   ) {
//     return this.productsService.remove(
//       id,
//     );
//   }
// }



import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll(
    @Query() query: ProductQueryDto,
  ) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
  ) {
    return this.productsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.productsService.remove(id);
  }
}