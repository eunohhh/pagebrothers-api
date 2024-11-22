export const paginatedExampleData = {
  totalPages: 0,
  totalElements: 0,
  size: 0,
  content: [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      author: 'string',
      authorProfileImage: 'string',
      body: 'string',
      createdAt: '2024-11-22T14:00:32.731Z',
      updatedAt: '2024-11-22T14:00:32.731Z',
    },
  ],
  number: 0,
  sort: {
    empty: true,
    sorted: true,
    unsorted: true,
  },
  numberOfElements: 0,
  pageable: {
    offset: 0,
    sort: {
      empty: true,
      sorted: true,
      unsorted: true,
    },
    paged: true,
    unpaged: true,
    pageNumber: 0,
    pageSize: 0,
  },
  first: true,
  last: true,
  empty: true,
};

export const rsvpInnerDataExample = {
  accepted: true,
  formValues: {
    additionalProp1: 'string',
    additionalProp2: 'string',
    additionalProp3: 'string',
  },
};

export const rsvpAnswerExampleData = {
  answered: true,
  data: rsvpInnerDataExample,
};

export const rsvpAnswersExampleData = {
  columns: [
    {
      id: 'string',
      title: 'string',
    },
  ],
  rows: [
    {
      no: 0,
      accepted: true,
      createdAt: '2024-11-22T14:10:20.986Z',
      updatedAt: '2024-11-22T14:10:20.986Z',
      updated: true,
    },
  ],
};
