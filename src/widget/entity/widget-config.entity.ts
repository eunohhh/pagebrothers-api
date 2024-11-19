import { Transform } from 'class-transformer';
import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import {
  Align,
  CongratulationLayoutKey,
  DdayDateFormatKey,
  GalleryLayoutCarouselAlignKey,
  GalleryLayoutKey,
  GreetingItem,
  GreetingNameFormatKey,
  GreetingNameLayoutKey,
  IntroDateFormatKey,
  IntroLayoutKey,
  LocationAddressFormatKey,
  LocationTrafficDescriptionItems,
  OwnerAccountGroup,
  RsvpExtraField,
  Size,
} from '../../common/type/common.type';
import { WidgetItemModel } from './widget-item.entity';

@Entity()
export class WidgetConfigModel extends BaseModel {
  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  title?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  align?: Align;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  hasICalButton?: boolean;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  differenceFormat?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  eventName?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  showTime?: boolean;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  layout?: CongratulationLayoutKey | GalleryLayoutKey | IntroLayoutKey;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  buttonLabel?: string;

  @Column({ type: 'jsonb', nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  accounts?: Record<string, OwnerAccountGroup>;

  // 추후 수정 요망
  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  items?: string; //EventSequenceItem[] | IInvitationImage[] | QnaItem[];

  @ManyToMany(() => ImageModel, (image) => image.singleItem)
  singleItem?: ImageModel[];

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  layoutCarouselAlignKey?: GalleryLayoutCarouselAlignKey;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  greetingText?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  nameLayoutKey?: GreetingNameLayoutKey;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  layoutKey?: GalleryLayoutKey;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  nameFormatKey?: GreetingNameFormatKey;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  withParent?: boolean; // = true

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  useFlower?: boolean;

  @Column({ type: 'jsonb', nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  hosts?: Record<string, GreetingItem>;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  showDateTime?: boolean;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  subTitle?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  customTextColor?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  showEventInformation?: boolean; // = true

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  dateFormatKey?: IntroDateFormatKey | DdayDateFormatKey; // = KO

  @ManyToMany(() => ImageModel, (image) => image.coverImage)
  @JoinTable({ name: 'coverImage' })
  @Transform(({ value }) => (value === null ? undefined : value))
  coverImage?: ImageModel[] | null;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  exposeMap?: boolean;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  addressFormatKey?: LocationAddressFormatKey;

  @Column({ type: 'jsonb', nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  trafficDescriptionItems?: LocationTrafficDescriptionItems[];

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  description?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  widgetTitle?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  size?: Size; // = md

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  url?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  aspectWidth?: number;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  aspectHeight?: number;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  text?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  rejectLabel?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  acceptLabel?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  isFloating?: boolean;

  @Column({ type: 'jsonb', nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  extraFields?: RsvpExtraField[];

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  eventDate?: string;

  @OneToOne(() => WidgetItemModel, (item) => item.config)
  relationItem: WidgetItemModel;
}
