import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { FilmEntity, FilmsRepository, ScheduleEntity } from '../films/films.repository';
import { CreateOrderRequestDto, TicketDto } from './dto/order.dto';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let filmsRepository: jest.Mocked<FilmsRepository>;

  const makeSchedule = (overrides: Partial<ScheduleEntity> = {}): ScheduleEntity => ({
    id: 'session-1',
    daytime: new Date('2025-01-01T12:00:00.000Z'),
    hall: 1,
    rows: 5,
    seats: 10,
    price: 300,
    taken: [],
    ...overrides,
  });

  const makeFilm = (overrides: Partial<FilmEntity> = {}): FilmEntity => ({
    id: 'film-1',
    rating: 8,
    director: 'Dir',
    tags: [],
    image: 'img',
    cover: 'cover',
    title: 'Title',
    about: 'About',
    description: 'Desc',
    schedule: [makeSchedule()],
    ...overrides,
  });

  const makeTicket = (overrides: Partial<TicketDto> = {}): TicketDto => ({
    film: 'film-1',
    session: 'session-1',
    daytime: '2025-01-01T12:00:00.000Z',
    row: 1,
    seat: 1,
    price: 300,
    ...overrides,
  });

  const makeRequest = (tickets: TicketDto[]): CreateOrderRequestDto => ({
    email: 'test@example.com',
    phone: '+79998887766',
    tickets,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FilmsRepository,
          useValue: {
            findById: jest.fn(),
            bookSeat: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(OrderService);
    filmsRepository = module.get(FilmsRepository) as jest.Mocked<FilmsRepository>;
  });

  it('должен кидать BadRequestException, если tickets пустой', async () => {
    const dto = makeRequest([]);

    await expect(
      service.createOrder({
        ...(dto as unknown as CreateOrderRequestDto),
        tickets: undefined,
      }),
    ).rejects.toThrow(BadRequestException);

    expect(filmsRepository.findById).not.toHaveBeenCalled();
    expect(filmsRepository.bookSeat).not.toHaveBeenCalled();
  });

  it('должен кидать NotFoundException, если фильм не найден', async () => {
    const ticket = makeTicket();
    const dto = makeRequest([ticket]);

    filmsRepository.findById.mockResolvedValue(null);

    await expect(service.createOrder(dto)).rejects.toThrow(NotFoundException);
    await expect(service.createOrder(dto)).rejects.toThrow(
      new NotFoundException(`Film not found: ${ticket.film}`),
    );

    expect(filmsRepository.findById).toHaveBeenCalledWith(ticket.film);
    expect(filmsRepository.bookSeat).not.toHaveBeenCalled();
  });

  it('должен кидать NotFoundException, если сессия не найдена у фильма', async () => {
    const ticket = makeTicket({ session: 'unknown-session' });
    const dto = makeRequest([ticket]);

    const film = makeFilm({
      schedule: [makeSchedule({ id: 'other-session' })],
    });

    filmsRepository.findById.mockResolvedValue(film);

    await expect(service.createOrder(dto)).rejects.toThrow(NotFoundException);
    await expect(service.createOrder(dto)).rejects.toThrow(
      new NotFoundException(`Session not found for film ${ticket.film}`),
    );

    expect(filmsRepository.findById).toHaveBeenCalledWith(ticket.film);
    expect(filmsRepository.bookSeat).not.toHaveBeenCalled();
  });

  it('должен кидать BadRequestException, если место вне диапазона', async () => {
    const ticket = makeTicket({ row: 10, seat: 1 });
    const dto = makeRequest([ticket]);

    const film = makeFilm();
    filmsRepository.findById.mockResolvedValue(film);

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
    await expect(service.createOrder(dto)).rejects.toThrow(
      new BadRequestException('Seat is out of range'),
    );

    expect(filmsRepository.bookSeat).not.toHaveBeenCalled();
  });

  it('должен кидать BadRequestException, если место уже занято (bookSeat вернул false)', async () => {
    const ticket = makeTicket();
    const dto = makeRequest([ticket]);
    const film = makeFilm();

    filmsRepository.findById.mockResolvedValue(film);
    filmsRepository.bookSeat.mockResolvedValue(false);

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
    await expect(service.createOrder(dto)).rejects.toThrow(
      new BadRequestException('Seat is already taken'),
    );

    expect(filmsRepository.bookSeat).toHaveBeenCalledWith(
      ticket.film,
      ticket.session,
      ticket.row,
      ticket.seat,
    );
  });

  it('должен успешно создавать заказ, когда все проверки проходят', async () => {
    const ticket = makeTicket();
    const dto = makeRequest([ticket]);
    const film = makeFilm();

    filmsRepository.findById.mockResolvedValue(film);
    filmsRepository.bookSeat.mockResolvedValue(true);

    const result = await service.createOrder(dto);

    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);

    const item = result.items[0];

    expect(typeof item.id).toBe('string');
    expect(item.id).toBeTruthy();

    expect(item.film).toBe(ticket.film);
    expect(item.session).toBe(ticket.session);
    expect(item.daytime).toBe(ticket.daytime);
    expect(item.row).toBe(ticket.row);
    expect(item.seat).toBe(ticket.seat);
    expect(item.price).toBe(ticket.price);

    expect(filmsRepository.findById).toHaveBeenCalledWith(ticket.film);
    expect(filmsRepository.bookSeat).toHaveBeenCalledWith(
      ticket.film,
      ticket.session,
      ticket.row,
      ticket.seat,
    );
  });
});
