export interface JoyApiOptions {
  appKey: string;
  secretKey: string;
  apiVersion?: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface PaginationParams {
  before?: string;
  after?: string;
  limit?: number;
  hasCount?: boolean;
}

export interface DateRangeParams {
  created_at_min?: string;
  created_at_max?: string;
  updated_at_min?: string;
  updated_at_max?: string;
}

export interface SortParams {
  order?: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: Meta;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: any;
  };
  timestamp: string;
}

export interface Meta {
  count?: number;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  hasNext: boolean;
  hasPre: boolean;
  total?: number;
  totalPage?: number;
}

export interface Program {
  id: string;
  title: string;
  type: 'earning' | 'spending' | 'tier_spending' | 'tier';
  event?: string;
  status: boolean;
  priority?: number;
  createdAt: string;
  updatedAt: string;
  expired?: boolean;
  isDraft?: boolean;
  earnBy?: 'price' | 'order';
  rateMoney?: number;
  earnPoint?: number;
  startDate?: string;
  endDate?: string;
  autoRemovePoints?: boolean;
  appliedPlaceOrderTo?: 'all' | 'vip-tier';
  appliedSource?: string[];
  translateTitle?: Record<string, string>;
  typeMilestone?: string | null;
  milestones?: any[];
  spendPoint?: number;
  earnAmount?: number;
  redeemType?: string;
  appliedTo?: string;
  appliedCollectionIds?: string[];
  redeemIn?: 'available_in_pos' | 'available_in_online_store';
  orderReq?: 'none' | 'min_amount';
  orderReqAmount?: number;
  minSpendPoint?: string;
  maxSpendPoint?: string;
  expiredTime?: string;
  userAvailability?: 'allUsers' | 'userRedeemed';
  showLoyaltyPage?: boolean;
  limitRedeem?: 'redeemWithoutLimit' | 'redeemLimit';
  totalLimitationRedeem?: number;
  combinedWith?: string[];
  specificProducts?: ProductInfo[];
  specificProductIds?: string[];
  specificCollections?: any[];
  variantIds?: string[];
  freeProductIds?: string[];
  giftStatus?: 'none' | 'hot' | 'expiring-soon';
  excludeProducts?: ProductInfo[];
  includeProducts?: ProductInfo[];
  conditions?: any[];
  earnPointsTiers?: TierEarnPoint[];
  roundingMethod?: 'round' | 'floor' | 'ceil';
  skipEarnPointGuest?: boolean;
  isEarned?: boolean;
}

export interface ProductInfo {
  id: string;
  title: string;
  image?: {
    src: string;
  };
}

export interface TierEarnPoint {
  earnPoint: number;
  rateMoney: number;
}

export interface Customer {
  id: string;
  shopifyCustomerId: number;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  type: 'member' | 'guest' | 'left';
  point: number;
  tierPoint: number;
  pendingPoint: number;
  totalSpent: number;
  totalEarnedPoints: number;
  hasPoint: boolean;
  hasJoinedProgram: boolean;
  orderCount: number;
  state: 'enabled' | 'disabled';
  latestActivity?: string;
  notifications?: any;
  acceptsMarketing: boolean;
  birthday?: string;
  dateOfBirth?: string;
  tierId?: string;
  tierName?: string;
  tierUpdatedAt?: string;
  phone?: string | null;
  pointsRemain?: number;
  birthMonth?: string;
  isCustomerB2B?: boolean;
  earnSignUp?: boolean;
  referralCode?: string;
  hasTier?: boolean;
  totalSpentCurrencyCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  shopId?: string;
  customerId: string;
  shopifyCustomerId?: number;
  email?: string;
  content?: string;
  type: string;
  source?: string;
  event?: string;
  oldPoint?: number;
  newPoint?: number;
  programId?: string | null;
  programTitle?: string | null;
  priceRuleId?: string | null;
  discountId?: string | null;
  couponCode?: string | null;
  orderId?: string | null;
  orderName?: string | null;
  orderNumber?: number | null;
  orderCurrency?: string | null;
  earnBy?: string | null;
  rateMoney?: number | null;
  earnPoint?: number | null;
  spendPoint?: number | null;
  referralCustomerEmail?: string | null;
  referredCustomerEmail?: string | null;
  milestoneOrder?: number | null;
  isPendingPointPlaceOrder?: boolean | null;
  refundPendingPoint?: number | null;
  pendingPointUntil?: string | null;
  adminNote?: string | null;
  userNote?: string | null;
  reason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  customerId: string;
  email: string;
  couponCode: string;
  programTitle: string;
  shopifyCustomerId: number;
  programDescription?: string;
  orderReqAmount?: string;
  expiredAt?: string | null;
  discountStatus: 'active' | 'used' | 'expired';
  program?: {
    id: string;
    title: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tier {
  id: string;
  name: string;
  icon?: string;
  iconCustom?: string;
  targetPoint: number;
  targetPointUpdate?: number;
  members: number;
  placedOrderReward?: boolean;
  rateMoney?: number;
  earnPoint?: number;
  shopId?: string;
  imageBlock?: string;
  tierRewards?: TierReward[];
  inactive?: boolean;
  isExclusiveTier?: boolean;
  prevNames?: string[];
  createdAt: string;
  updatedAt: string;
  isSystemTier?: boolean;
  systemType?: string;
  textColor?: string;
  boxBgColor?: string;
}

export interface TierReward {
  id: string;
  status: boolean;
  title: string;
  redeemType: 'fixed' | 'dynamic';
  spendPoint?: number;
  minSpendPoint?: string;
  maxSpendPoint?: string;
  appliedTo: 'all' | 'specific' | 'sf_product';
  orderReq: 'none' | 'min_amount';
  orderReqAmount?: number;
  expiredAfter?: string;
  expiredTime?: string | null;
  type: string;
  codeName?: string;
  earnAmount?: string;
  event?: string;
  bonusPoints?: string;
  priority?: number;
  showLoyaltyPage?: boolean;
  translateTitle?: Record<string, string>;
  expired?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  name: string;
  domain: string;
  email: string;
  plan: string;
  currency: string;
  timezone: string;
  countryCode: string;
  isInstalled: boolean;
  createdAt: string;
  updatedAt: string;
}