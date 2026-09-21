export const cacheTTL = {
  IDENTITY: {
    USER_PROFILE: 60 * 60, //1 hour
    SESSION: 15 * 60, //15 minutes
  },
  CUSTOMER: {
    PROFILE: 60 * 60, //1 hour
    ADDRESSES: 30 * 60, //30 minutes
  },
  RESTAURANT: {
    PROFILE: 60 * 60, //1 hour
    MENU: 5 * 60, //5 minutes
  },
  ORDERING: {
    ORDER: 15, //15 seconds
  },
  DRIVER: {
    PROFILE: 60, //1 minute
    AVAILABLETY: 15, //15 seconds
  },
} as const;
