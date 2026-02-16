import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { FilmEntity, FilmsRepository, ScheduleEntity } from './films.repository';
import { FilmsService } from './films.service';

describe('FilmsService', () => {
  let service: FilmsService;
  let filmsRepository: jest.Mocked<FilmsRepository>;

  const makeSchedule = (): ScheduleEntity => ({
    id: 'session-1',
    daytime: new Date('2025-01-01T12:00:00.000Z'),
    hall: 1,
    rows: 5,
    seats: 10,
    price: 300,
    taken: ['1:1', '1:2'],
  });

  const makeFilm = (overrides: Partial<FilmEntity> = {}): FilmEntity => ({
    id: 'film-1',
    rating: 8,
    director: 'Some Director',
    tags: ['drama', 'comedy'],
    image: 'image-url',
    cover: 'cover-url',
    title: 'Test Film',
    about: 'about film',
    description: 'long description',
    schedule: [makeSchedule()],
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(FilmsService);
    filmsRepository = module.get(FilmsRepository) as jest.Mocked<FilmsRepository>;
  });

  it('getFilms должен возвращать список фильмов с корректным total и маппингом DTO', async () => {
    const film = makeFilm();
    filmsRepository.findAll.mockResolvedValue([film]);

    const result = await service.getFilms();

    expect(filmsRepository.findAll).toHaveBeenCalledTimes(1);

    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);

    const dto = result.items[0];

    expect(dto).toEqual({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: [
        {
          id: film.schedule[0].id,
          daytime: film.schedule[0].daytime.toISOString(),
          hall: film.schedule[0].hall,
          rows: film.schedule[0].rows,
          seats: film.schedule[0].seats,
          price: film.schedule[0].price,
          taken: film.schedule[0].taken,
        },
      ],
    });
  });

  it('getFilmSchedule должен бросать NotFoundException, если фильм не найден', async () => {
    filmsRepository.findById.mockResolvedValue(null);

    await expect(service.getFilmSchedule('unknown-id')).rejects.toThrow(NotFoundException);
    expect(filmsRepository.findById).toHaveBeenCalledWith('unknown-id');
  });

  it('getFilmSchedule должен возвращать FilmScheduleResponseDto с расписанием и total/items', async () => {
    const film = makeFilm();
    filmsRepository.findById.mockResolvedValue(film);

    const result = await service.getFilmSchedule('film-1');

    expect(filmsRepository.findById).toHaveBeenCalledWith('film-1');

    expect(result.id).toBe(film.id);
    expect(result.title).toBe(film.title);
    expect(result.rating).toBe(film.rating);
    expect(result.director).toBe(film.director);

    expect(result.schedule).toHaveLength(film.schedule.length);
    expect(result.items).toHaveLength(film.schedule.length);
    expect(result.total).toBe(film.schedule.length);

    const scheduleDto = result.schedule[0];
    const session = film.schedule[0];

    expect(scheduleDto).toEqual({
      id: session.id,
      daytime: session.daytime.toISOString(),
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken,
    });
  });
});
