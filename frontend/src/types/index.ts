export type CLAIMS_TYPE = {
  content: string;
  category: string;
  verificationStatus: string;
  confidenceScore: number;
  _id: string;
  createdAt: string;
};

export type CLAIM_STATS = {
  totalClaims: number;
  verifiedClaims: number;
  questionableClaims: number;
  debunkedClaims: number;
};

export type INFLUENCER_TYPE = {
  claimStats: CLAIM_STATS;
  debunkedClaims: number;
  questionableClaims: number;
  totalClaims: number;
  verifiedClaims: number;
  createdAt: string;
  followerCount: number;
  handle: string;
  id: string;
  name: string;
  platform: string;
  trustScore: number;
  updatedAt: string;
};

export type INFLUENCER_DETAIL = {
  claimStats: CLAIMS_TYPE[];
  createdAt: string;
  followerCount: number;
  followersCount: number;
  handle: string;
  name: string;
  platform: string;
  trustScore: number;
  updatedAt: string;
  __v: number;
  _id: string;
};

export type ANALYTICS_TYPE = {
  activeInfluencers: number;
  averageTrustScore: number;
  verifiedClaims: number;
};
