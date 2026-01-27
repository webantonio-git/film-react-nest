import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { FilmScheduleResponseDto, FilmsResponseDto } from './dto/films.dto';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: jest.Mocked<FilmsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            getFilms: jest.fn(),
            getFilmSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(FilmsController);
    service = module.get(FilmsService) as jest.Mocked<FilmsService>;
  });

  it('должен вернуть список фильмов из сервиса', async () => {
    const result: FilmsResponseDto = {
      total: 1,
      items: [
        {
          id: '1',
          rating: 10,
          director: 'Some Director',
          tags: ['tag'],
          title: 'Test film',
          about: 'about',
          description: 'desc',
          image: 'image',
          cover: 'cover',
          schedule: [],
        },
      ],
    };

    service.getFilms.mockResolvedValue(result);

    await expect(controller.getFilms()).resolves.toBe(result);
    expect(service.getFilms).toHaveBeenCalledTimes(1);
  });

  it('при ошибке getFilms логирует в console.error и бросает InternalServerErrorException', async () => {
    const error = new Error('boom');
    service.getFilms.mockRejectedValue(error);

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined as unknown as void);

    await expect(controller.getFilms()).rejects.toThrow(InternalServerErrorException);

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const [msg, meta] = consoleSpy.mock.calls[0];

    expect(String(msg)).toContain('getFilms CI error');
    expect(meta).toMatchObject({
      message: error.message,
      name: error.name,
    });

    consoleSpy.mockRestore();
  });

  it('должен вернуть расписание фильма из сервиса', async () => {
    const result: FilmScheduleResponseDto = {
      id: '1',
      rating: 9,
      director: 'Dir',
      tags: ['tag'],
      title: 'Film',
      about: 'about',
      description: 'desc',
      image: 'image',
      cover: 'cover',
      schedule: [],
      total: 0,
      items: [],
    };

    service.getFilmSchedule.mockResolvedValue(result);

    await expect(controller.getFilmSchedule('1')).resolves.toBe(result);
    expect(service.getFilmSchedule).toHaveBeenCalledWith('1');
  });

  it('при ошибке getFilmSchedule логирует в console.error и бросает InternalServerErrorException', async () => {
    const error = new Error('schedule fail');
    service.getFilmSchedule.mockRejectedValue(error);

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined as unknown as void);

    await expect(controller.getFilmSchedule('1')).rejects.toThrow(InternalServerErrorException);

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const [msg, meta] = consoleSpy.mock.calls[0];

    expect(String(msg)).toContain('getFilmSchedule CI error');
    expect(meta).toMatchObject({
      message: error.message,
      name: error.name,
    });

    consoleSpy.mockRestore();
  });
});
