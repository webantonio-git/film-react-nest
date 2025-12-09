import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { CreateOrderResponseDto, OrderItemResponseDto } from './dto/order.dto';

type OrderRequestTicket = {
  film?: string;
  session?: string;
  daytime?: string;
  row?: number;
  seat?: number;
  price?: number;
};

type OrderRequest = {
  tickets?: OrderRequestTicket[];
};

@Controller('order')
export class OrderController {
  @Post()
  @HttpCode(200)
  createOrder(@Body() body: OrderRequest): CreateOrderResponseDto {
    const tickets = Array.isArray(body?.tickets) ? body.tickets : [];

    const items: OrderItemResponseDto[] = tickets.map((t, i) => ({
      id: String(i + 1),
      film: t.film ?? '',
      session: t.session ?? '',
      daytime: t.daytime ?? '',
      row: t.row ?? 0,
      seat: t.seat ?? 0,
      price: t.price ?? 0,
    }));

    return {
      total: items.length,
      items,
    };
  }
}
