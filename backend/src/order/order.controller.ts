import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { CreateOrderRequestDto, CreateOrderResponseDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(200)
  createOrder(
    @Body() body: CreateOrderRequestDto,
  ): Promise<CreateOrderResponseDto> {
    return this.orderService.createOrder(body);
  }
}
