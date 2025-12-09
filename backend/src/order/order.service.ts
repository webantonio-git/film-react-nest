import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { FilmsRepository } from '../repository/films.repository';
import {
  CreateOrderRequestDto,
  CreateOrderResponseDto,
  OrderItemResponseDto,
  TicketDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(
    dto: CreateOrderRequestDto,
  ): Promise<CreateOrderResponseDto> {
    const tickets: TicketDto[] = dto.tickets ?? [];
    if (tickets.length === 0) {
      throw new BadRequestException('No tickets provided');
    }

    const items: OrderItemResponseDto[] = [];

    for (const ticket of tickets) {
      const film = await this.filmsRepository.findById(ticket.film);
      if (!film) {
        throw new NotFoundException(`Film not found: ${ticket.film}`);
      }

      const session = film.schedule.find((s) => s.id === ticket.session);
      if (!session) {
        throw new NotFoundException(
          `Session not found for film ${ticket.film}`,
        );
      }

      if (
        ticket.row < 1 ||
        ticket.row > session.rows ||
        ticket.seat < 1 ||
        ticket.seat > session.seats
      ) {
        throw new BadRequestException('Seat is out of range');
      }

      const booked = await this.filmsRepository.bookSeat(
        ticket.film,
        ticket.session,
        ticket.row,
        ticket.seat,
      );

      if (!booked) {
        throw new BadRequestException('Seat is already taken');
      }

      const item: OrderItemResponseDto = {
        id: this.generateId(),
        film: ticket.film,
        session: ticket.session,
        daytime: ticket.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: ticket.price,
      };

      items.push(item);
    }

    return {
      total: items.length,
      items,
    };
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
