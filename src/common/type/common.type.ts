import { Request } from 'express';
import { Providers } from '../const/provider.const';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    name: string;
    profileImage: string;
    provider: Providers;
    providerId: string;
    redirect_uri?: string;
    register_uri?: string;
    clientProtocol?: string;
    clientHost?: string;
  };
}

export interface StateType {
  protocol: string;
  host: string;
  redirect_uri?: string;
  register_uri?: string;
}

export const COLOR_HIGHLIGHTS = {
  black: [
    '[--theme-black:15,15,15]',
    '[--theme-inter:25,25,25]',
    '[--theme-colored:40,40,40]',
    '[--theme-block:0,0,0]',
  ],
  slate: [
    '[--theme-black:15,23,42]',
    '[--theme-inter:51,65,85]',
    '[--theme-colored:100,116,139]',
    '[--theme-block:0,0,0]',
  ],
  stone: [
    '[--theme-black:28,25,23]',
    '[--theme-inter:68,64,60]',
    '[--theme-colored:120,113,108]',
    '[--theme-block:0,0,0]',
  ],
  rose: [
    '[--theme-black:50,5,20]',
    '[--theme-inter:220,50,110]',
    '[--theme-colored:240,70,150]',
    '[--theme-block:0,0,0]',
  ],
  orange: [
    '[--theme-black:45,16,6]',
    '[--theme-inter:220,95,15]',
    '[--theme-colored:249,115,22]',
    '[--theme-block:0,0,0]',
  ],
  yellow: [
    '[--theme-black:46,25,6]',
    '[--theme-inter:180,120,7]',
    '[--theme-colored:234,179,8]',
    '[--theme-block:0,0,0]',
  ],
  lime: [
    '[--theme-black:20,32,7]',
    '[--theme-inter:90,150,15]',
    '[--theme-colored:132,204,22]',
    '[--theme-block:0,0,0]',
  ],
  emerald: [
    '[--theme-black:3,36,27]',
    '[--theme-inter:4,120,87]',
    '[--theme-colored:16,185,129]',
    '[--theme-block:0,0,0]',
  ],
  sky: [
    '[--theme-black:5,31,46]',
    '[--theme-inter:3,105,161]',
    '[--theme-colored:14,165,233]',
    '[--theme-block:0,0,0]',
  ],
  blue: [
    '[--theme-black:14,29,68]',
    '[--theme-inter:29,78,216]',
    '[--theme-colored:59,130,246]',
    '[--theme-block:0,0,0]',
  ],
  indigo: [
    '[--theme-black:24,23,64]',
    '[--theme-inter:67,56,202]',
    '[--theme-colored:99,102,241]',
    '[--theme-block:0,0,0]',
  ],
  violet: [
    '[--theme-inter:109,40,217]',
    '[--theme-colored:139,92,246]',
    '[--theme-black:30,10,61]',
    '[--theme-block:0,0,0]',
  ],
};

export interface IInvitationTemplate extends IInvitation {
  templateId: string;
  title: string;
}

export interface IInvitation {
  id: string;
  eventAt: string;
  createdAt: string;
  updatedAt: string;
  location: IInvitationLocation;
  design: IInvitationDesign;
  owners: IInvitationOwner[];
  editors: IInvitationEditor[];
  widgets: (WidgetItem & { index?: number })[];
  meta: IInvitationMeta;
  share: IInvitationShare | null;
  images: Record<string, IInvitationImageData>;
  editingExpired: boolean;
}

/** INVITATION : SHARE */
export interface IInvitationShare {
  shareKey: string;
  visible: boolean;
}

/** INVITATION : META */
export interface IInvitationMeta {
  title: string;
  description: string;
  thumbnailId: string | null;
  kakaotalkThumbnailId: string | null;
  kakaotalkTitle: string | null;
  kakaotalkDescription: string | null;
  kakaotalkUseLocationButton: boolean;
  isDefaultKakaotalkThumbnailId: boolean;
  isDefaultThumbnailId: boolean;
}

/** INVITATION : EDITOR */
export interface IInvitationEditor {
  id: string;
  name: string;
  profileImage: string;
}

/** INVITATION : LOCATION */
export interface IInvitationLocation {
  mapType?: string | null;
  placeId?: string | null;
  address: string;
  roadAddress: string;
  placeName: string;
  placeDetail: string;
  coord: number[];
}

/** INVITATION : DESIGN */
export interface IInvitationDesign {
  layoutType: 'WIDGETS';
  brandColor: keyof typeof COLOR_HIGHLIGHTS;
  font: string;
  textSize: Size;
  zoomDisabled: ZoomDisabledKey;
}

/** INVITATION : OWNER 혼주 */
export interface IInvitationOwner {
  id: string;
  role: string;
  name: string; // from owners[].personName
}

/** INVITATION : IMAGE */
export interface IInvitationImage {
  id: string;
}

export interface IInvitationImageData {
  id: string;
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
  cropData?: IInvitationImageCropData | null;
}

export interface IInvitationImageCropBoxData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IInvitationImageCropData extends IInvitationImageCropBoxData {
  url: string;
}

export type Align = 'LEFT' | 'RIGHT' | 'CENTER';

export type Size = 'sm' | 'md' | 'lg';

export type ZoomDisabledKey = 'none' | 'photo' | 'all';

export type OrderType = 'THREE_MONTH_SHARE' | 'FOREVER_SHARE';

// WIDGET
export type WidgetType =
  | 'CONGRATULATION'
  | 'LOCATION'
  | 'EVENT_SEQUENCE'
  | 'GALLERY'
  | 'GREETING'
  | 'INTRO'
  | 'MESSAGE'
  | 'QNA'
  | 'VIDEO'
  | 'CALENDAR'
  | 'GUESTBOOK'
  | 'RSVP'
  | 'DDAY'
  | 'SHARE';

export type WidgetItem =
  | CongratulationWidgetItem
  | LocationWidgetItem
  | EventSequenceWidgetItem
  | GalleryWidgetItem
  | GreetingWidgetItem
  | IntroWidgetItem
  | MessageWidgetItem
  | QnaWidgetItem
  | VideoWidgetItem
  | CalendarWidgetItem
  | GuestbookWidgetItem
  | RsvpWidgetItem
  | DdayWidgetItem
  | ShareWidgetItem;

export interface CongratulationWidgetItem {
  id: string;
  type: 'CONGRATULATION';
  config: CongratulationWidgetConfig;
}
export interface LocationWidgetItem {
  id: string;
  type: 'LOCATION';
  config: LocationWidgetConfig;
}
export interface EventSequenceWidgetItem {
  id: string;
  type: 'EVENT_SEQUENCE';
  config: EventSequenceWidgetConfig;
}
export interface GalleryWidgetItem {
  id: string;
  type: 'GALLERY';
  config: GalleryWidgetConfig;
}
export interface GreetingWidgetItem {
  id: string;
  type: 'GREETING';
  config: GreetingWidgetConfig;
}
export interface IntroWidgetItem {
  id: string;
  type: 'INTRO';
  config: IntroWidgetConfig;
}
export interface MessageWidgetItem {
  id: string;
  type: 'MESSAGE';
  config: MessageWidgetConfig;
}
export interface QnaWidgetItem {
  id: string;
  type: 'QNA';
  config: QnaWidgetConfig;
}
export interface VideoWidgetItem {
  id: string;
  type: 'VIDEO';
  config: VideoWidgetConfig;
}
export interface CalendarWidgetItem {
  id: string;
  type: 'CALENDAR';
  config: CalendarWidgetConfig;
}
export interface GuestbookWidgetItem {
  id: string;
  type: 'GUESTBOOK';
  config: GuestbookWidgetConfig;
}
export interface RsvpWidgetItem {
  id: string;
  type: 'RSVP';
  config: RsvpWidgetConfig;
}
export interface DdayWidgetItem {
  id: string;
  type: 'DDAY';
  config: DdayWidgetConfig;
}

/** CALENDAR (캘린더) */
export interface CalendarWidgetConfig {
  title: string;
  align?: Align;
  hasICalButton: boolean;
  differenceFormat: string;
  eventName: string;
  showTime: boolean;
}

/** CONGRATULATION (축의금) */
export interface CongratulationWidgetConfig {
  layout: CongratulationLayoutKey;
  title: string;
  align?: Align;
  buttonLabel: string;
  accounts: Record<string, OwnerAccountGroup>; // config.accountMap + owners
}

export interface OwnerAccountGroup {
  use: boolean; // = true
  label: string; // from owners[].personName
  items: OwnerAccountItem[];
}
export interface OwnerAccountItem {
  role: string;
  name: string;
  bank: string;
  number: string;
}

export type CongratulationLayoutKey = 'COLLAPSIBLE' | 'SPREADED';

/** EVENT_SEQUENCE (예식 구성) */
export interface EventSequenceWidgetConfig {
  title: string;
  align?: Align;
  items: EventSequenceItem[];
}

export interface EventSequenceItem {
  title: string;
  description: string;
}
/** GALLERY (갤러리) */
export interface GalleryWidgetConfig {
  title: string;
  align?: Align;
  singleItem: IInvitationImage | null;
  items: IInvitationImage[];
  layoutKey: GalleryLayoutKey;
  layoutCarouselAlignKey: GalleryLayoutCarouselAlignKey;
}

export type GalleryLayoutKey = 'TILING' | 'CAROUSEL' | 'SINGLE';

export type GalleryLayoutCarouselAlignKey = 'WIDTH' | 'HEIGHT';

/** GREETING (인사말) */
export interface GreetingWidgetConfig {
  title: string;
  greetingText: string;
  nameLayoutKey: GreetingNameLayoutKey;
  nameFormatKey: GreetingNameFormatKey;
  align: Align;
  withParent: boolean; // = true
  useFlower: boolean;
  hosts: Record<string, GreetingItem>;
}

export interface GreetingItem {
  name: string; // from owners[].personName
  level: string; // from owners[].level
  fatherName: string; // from owners[].father.use && owners[].father.personName
  motherName: string; // from owners[].mother.use && owners[].mother.personName
  isFatherDeceased: boolean; // from owners[].father.isDeceased
  isMotherDeceased: boolean; // from owners[].mother.isDeceased
}

export type GreetingNameLayoutKey = 'VERTICAL' | 'HORIZONTAL';

export type GreetingNameFormatKey =
  /** 누구와 누구의 딸, 고영희 */
  | 'LEVEL_AND_FULL_NAME_WITH_PARENT'
  /** 모 누구 - 부 누구의 딸, 고영희 */
  | 'FULL_NAME_WITH_PREFIX_PARENT'
  /** 모 누구 - 부 누구의 딸, 신부 고영희 */
  | 'ROLE_AND_FULL_NAME_WITH_PREFIX_PARENT'
  /** 신부 고영희 */
  | 'ROLE_AND_FULL_NAME'
  /** 고영희 */
  | 'FULL_NAME';

/** GUESTBOOK (방명록) */
export interface GuestbookWidgetConfig {
  title: string;
  showDateTime: boolean; // = true
}

/** INTRO (인트로) */
export interface IntroWidgetConfig {
  title: string; // = config.title || {owners[].role} {owners[].name}
  layoutKey: IntroLayoutKey;
  subTitle: string;
  coverImage: IInvitationImageData | null; // IInvitationImageData 타입으로 변경(오은)
  align: Align;
  customTextColor: string;
  showEventInformation: boolean; // = true
  dateFormatKey: IntroDateFormatKey; // = KO
}

export type IntroLayoutKey =
  | 'ONLY_TEXT'
  | 'ONLY_IMAGE'
  | 'IMAGE_FLOW'
  | 'IMAGE_FLOW_REVERSE'
  | 'IMAGE_BACKGROUND'
  | 'IMAGE_ARCH_FRAME'
  | 'IMAGE_ROUND_FRAME';
export type IntroDateFormatKey =
  | 'KO'
  | 'KO_EXCLUDE_TIME'
  | 'EN'
  | 'EN_EXCLUDE_TIME';

/** LOCATION (오시는 길) */
export interface LocationWidgetConfig {
  title?: string;
  exposeMap: boolean;
  addressFormatKey: LocationAddressFormatKey;
  trafficDescriptionItems: LocationTrafficDescriptionItems[];
}

export interface LocationTrafficDescriptionItems {
  title: string;
  description: string;
}
export type LocationAddressFormatKey = 'ROAD' | 'LOT_NUMBER';

/** MESSAGE (메시지) */
export interface MessageWidgetConfig {
  widgetTitle: string;
  title: string;
  align: Align;
  size: Size; // = md
}

/** QNA (질문과 답변) */
export interface QnaWidgetConfig {
  title: string;
  align?: Align;
  items: QnaItem[];
}

export interface QnaItem {
  question: string;
  answer: string;
}

/** VIDEO (비디오) */
export interface VideoWidgetConfig {
  url: string;
  aspectWidth: number;
  aspectHeight: number;
}

/** RSVP (참석 여부) */
export interface RsvpWidgetConfig {
  title: string;
  text: string;
  align: Align;
  rejectLabel: string;
  acceptLabel: string;
  isFloating: boolean;
  extraFields: RsvpExtraField[];
}

/** INVITATION : RSVP EXTRA CONFIG */
export interface RsvpExtraField {
  id: string;
  type: RsvpExtraFieldType;
  label: string;
  needResponseRejected: boolean;
  placeholder: string;
  options: string[];
  optional?: boolean;
}

export type RsvpExtraFieldType =
  | 'InputText'
  | 'InputNumber'
  | 'Radio'
  | 'Select';

/** DDay (디데이) */
export interface DdayWidgetConfig {
  title: string;
  align: Align;
  eventDate: string;
  dateFormatKey: DdayDateFormatKey;
}

export type DdayDateFormatKey = 'DEFAULT' | 'DAYS' | 'HOURS';

export interface ShareWidgetItem {
  id: string;
  type: 'SHARE';
  config: ShareWidgetConfig;
}

export interface ShareWidgetConfig {
  title: string;
}
