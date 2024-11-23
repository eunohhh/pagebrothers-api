export const locationExampleData = {
  address: 'string',
  roadAddress: 'string',
  placeName: 'string',
  placeDetail: 'string',
  coord: [0],
  placeId: 'string',
  mapType: 'string',
};

export const designExampleData = {
  layoutType: 'WIDGETS',
  brandColor: 'string',
  font: 'string',
  textSize: 'string',
  zoomDisabled: 'string',
};

export const configExampleData = {
  additionalProp1: {},
  additionalProp2: {},
  additionalProp3: {},
};

export const stickerExampleData = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  imageId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  data: {
    top: 0,
    left: 0,
    width: 0,
    opacity: 0,
  },
  widgetId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
};

export const imageExampleData = {
  addtionalProps1: {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    url: 'string',
  },
  additionalProp2: {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    url: 'string',
    dimensions: {
      width: 0,
      height: 0,
    },
    cropData: {
      url: 'string',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  },
};

export const editorExampleData = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'string',
  profileImage: 'string',
};

export const ownerExampleData = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'string',
};

export const widgetExampleData = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  type: 'CONGRATULATION',
  index: 0,
  config: configExampleData,
  stickers: [stickerExampleData],
};

export const shareExampleData = {
  shareKey: 'string',
  visible: true,
  expiredAt: '2024-11-22T13:06:32.460Z',
};

export const metaExampleData = {
  thumbnailId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  title: 'string',
  description: 'string',
  kakaotalkThumbnailId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  kakaotalkTitle: 'string',
  kakaotalkDescription: 'string',
  kakaotalkUseLocationButton: true,
  isDefaultKakaotalkThumbnailId: true,
  isDefaultThumbnailId: true,
};

export const invitationExampleData = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  eventAt: '2024-11-22T13:06:32.460Z',
  createdAt: '2024-11-22T13:06:32.460Z',
  updatedAt: '2024-11-22T13:06:32.460Z',
  location: locationExampleData,
  design: designExampleData,
  owners: [ownerExampleData],
  widgets: [widgetExampleData],
  images: imageExampleData,
  fullDaySchedule: true,
  editingExpired: true,
  editors: [editorExampleData],
  share: shareExampleData,
  meta: metaExampleData,
};

export const postInvitationExampleData = {
  eventAt: '2024-11-22T13:17:16.174Z',
  fullDaySchedule: true,
  location: {
    address: 'string',
    roadAddress: 'string',
    placeName: 'string',
    placeDetail: 'string',
    coord: [0],
    placeId: 'string',
    mapType: 'string',
  },
  owners: [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'string',
    },
  ],
  templateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
};

export const orderExampleData = {
  orderId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  plan: 'THREE_MONTH_SHARE',
  orderName: 'string',
  amount: 0,
  originAmount: 0,
  expiredAt: '2024-11-22T13:44:08.063Z',
  couponCode: 'string',
  isFreeOrder: true,
};

export const completedOrderExampleData = {
  paymentKey: 'string',
  amount: 0,
};
