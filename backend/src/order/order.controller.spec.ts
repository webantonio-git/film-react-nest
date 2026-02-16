import { Test, TestingModule } from '@nestjs/testing';

import { CreateOrderRequestDto, CreateOrderResponseDto } from './dto/order.dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(OrderController);
    service = module.get(OrderService) as jest.Mocked<OrderService>;
  });

  it('должен проксировать создание заказа в OrderService', async () => {
    const dto: CreateOrderRequestDto = {
      email: 'test@example.com',
      phone: '+79998887766',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '2025-01-01T10:00:00.000Z',
          row: 1,
          seat: 2,
          price: 300,
        },
      ],
    };

    const response: CreateOrderResponseDto = {
      total: 1,
      items: [
        {
          id: 'order-1',
          film: 'film-1',
          session: 'session-1',
          daytime: dto.tickets[0].daytime,
          row: dto.tickets[0].row,
          seat: dto.tickets[0].seat,
          price: dto.tickets[0].price,
        },
      ],
    };

    service.createOrder.mockResolvedValue(response);

    await expect(controller.createOrder(dto)).resolves.toBe(response);
    expect(service.createOrder).toHaveBeenCalledTimes(1);
    expect(service.createOrder).toHaveBeenCalledWith(dto);
  });
});
