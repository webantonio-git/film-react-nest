import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { ScheduleEntityOrm } from './schedule.entity';

@Entity({ name: 'films' })
export class FilmEntityOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'double precision' })
  rating!: number;

  @Column({ type: 'varchar' })
  director!: string;

  @Column({ type: 'text' })
  tags!: string;

  @Column({ type: 'varchar' })
  image!: string;

  @Column({ type: 'varchar' })
  cover!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar' })
  about!: string;

  @Column({ type: 'varchar' })
  description!: string;

  @OneToMany(() => ScheduleEntityOrm, (s) => s.film)
  schedule!: ScheduleEntityOrm[];
}
