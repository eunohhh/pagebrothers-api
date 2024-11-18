import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import { Column, Entity, ManyToMany, OneToOne } from 'typeorm';
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
  title?: string;

  @Column({ nullable: true })
  align?: Align;

  @Column({ nullable: true })
  hasICalButton?: boolean;

  @Column({ nullable: true })
  differenceFormat?: string;

  @Column({ nullable: true })
  eventName?: string;

  @Column({ nullable: true })
  showTime?: boolean;

  @Column({ nullable: true })
  layout?: CongratulationLayoutKey | GalleryLayoutKey | IntroLayoutKey;

  @Column({ nullable: true })
  buttonLabel?: string;

  @Column({ type: 'jsonb', nullable: true })
  accounts?: Record<string, OwnerAccountGroup>;

  // 추후 수정 요망
  @Column({ nullable: true })
  items?: string; //EventSequenceItem[] | IInvitationImage[] | QnaItem[];

  @ManyToMany(() => ImageModel, (image) => image.singleItem)
  singleItem?: ImageModel[];

  @Column({ nullable: true })
  layoutCarouselAlignKey?: GalleryLayoutCarouselAlignKey;

  @Column({ nullable: true })
  greetingText?: string;

  @Column({ nullable: true })
  nameLayoutKey?: GreetingNameLayoutKey;

  @Column({ nullable: true })
  nameFormatKey?: GreetingNameFormatKey;

  @Column({ nullable: true })
  withParent?: boolean; // = true

  @Column({ nullable: true })
  useFlower?: boolean;

  @Column({ type: 'jsonb', nullable: true })
  hosts?: Record<string, GreetingItem>;

  @Column({ nullable: true })
  showDateTime?: boolean;

  @Column({ nullable: true })
  subTitle?: string;

  customTextColor: string;
  @Column({ nullable: true })
  showEventInformation?: boolean; // = true

  @Column({ nullable: true })
  dateFormatKey?: IntroDateFormatKey | DdayDateFormatKey; // = KO

  @ManyToMany(() => ImageModel, (image) => image.coverImage)
  coverImage?: ImageModel[];

  @Column({ nullable: true })
  exposeMap?: boolean;

  @Column({ nullable: true })
  addressFormatKey?: LocationAddressFormatKey;

  @Column({ type: 'jsonb', nullable: true })
  trafficDescriptionItems?: LocationTrafficDescriptionItems[];

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  widgetTitle?: string;

  @Column({ nullable: true })
  size?: Size; // = md

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  aspectWidth?: number;

  @Column({ nullable: true })
  aspectHeight?: number;

  @Column({ nullable: true })
  text?: string;

  @Column({ nullable: true })
  rejectLabel?: string;

  @Column({ nullable: true })
  acceptLabel?: string;

  @Column({ nullable: true })
  isFloating?: boolean;

  @Column({ type: 'jsonb', nullable: true })
  extraFields?: RsvpExtraField[];

  @Column({ nullable: true })
  eventDate?: string;

  @OneToOne(() => WidgetItemModel, (item) => item.config)
  relationItem: WidgetItemModel;
}
