// DTO для /order

export class TicketDto {
  film: string; // uuid фильма
  session: string; // uuid сеанса
  daytime: string; // ISO date-time
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderRequestDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}

export class OrderItemResponseDto extends TicketDto {
  id: string;
}

export class CreateOrderResponseDto {
  total: number;
  items: OrderItemResponseDto[];
}
