import { VerificationStatus } from "../models/claim/claim.document"

export function calculateInfluencerTrustScore(
  claims: { verificationStatus: VerificationStatus; trustScore: number }[]
) {
  let totalWeightedTrust = 0
  let totalWeight = 0
  let debunkedCount = 0

  claims.forEach((claim) => {
    let weight = 0
    if (claim.verificationStatus === VerificationStatus.Verified) weight = 1.0
    else if (claim.verificationStatus === VerificationStatus.Questionable) weight = 0.5
    else if (claim.verificationStatus === VerificationStatus.Debunked) weight = 0.0

    totalWeightedTrust += claim.trustScore * weight
    totalWeight += weight
    if (claim.verificationStatus === VerificationStatus.Debunked) debunkedCount++
  })

  const weightedAverage = totalWeight > 0 ? totalWeightedTrust / totalWeight : 0

  // Apply exponential decay for debunked claims
  const adjustedScore = weightedAverage * (1 - debunkedCount / claims.length)

  return Math.round(adjustedScore)
}
