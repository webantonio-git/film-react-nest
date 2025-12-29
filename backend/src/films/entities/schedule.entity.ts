import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FilmEntityOrm } from './film.entity';

@Entity({ name: 'schedules' })
@Index(['filmId'])
export class ScheduleEntityOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar' })
  daytime!: string;

  @Column({ type: 'integer' })
  hall!: number;

  @Column({ type: 'integer' })
  rows!: number;

  @Column({ type: 'integer' })
  seats!: number;

  @Column({ type: 'double precision' })
  price!: number;

  @Column({ type: 'text' })
  taken!: string;

  @Column({ type: 'uuid', name: 'filmId', nullable: true })
  filmId!: string | null;

  @ManyToOne(() => FilmEntityOrm, (film) => film.schedule, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'filmId' })
  film!: FilmEntityOrm;
}
