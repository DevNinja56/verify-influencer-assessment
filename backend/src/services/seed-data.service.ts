import Influencer from "../models/influencer/influencer.model"
import Claim from "../models/claim/claim.model"

const staticClaims = [
  {
    content: "Claim: Drinking a glass of warm lemon water every morning boosts immunity.",
    influencer: "HealthyHabitsGuru",
    platform: "Twitter"
  },
  {
    content: "Claim: Regular consumption of chia seeds can help reduce cholesterol levels.",
    influencer: "HealthyHabitsGuru",
    platform: "Instagram"
  },
  {
    content: "Claim: Taking vitamin C supplements prevents the common cold.",
    influencer: "HealthyHabitsGuru",
    platform: "Facebook"
  },

  {
    content: "Claim: A ketogenic diet can reverse type 2 diabetes.",
    influencer: "KetoLifeExpert",
    platform: "Podcast"
  },

  {
    content: "Claim: Sitting for long hours is as harmful as smoking.",
    influencer: "OfficeHealthCoach",
    platform: "Twitter"
  },
  {
    content: "Claim: Regular stretching can reduce the risk of chronic pain.",
    influencer: "OfficeHealthCoach",
    platform: "Instagram"
  },
  {
    content: "Claim: Walking meetings improve productivity and health.",
    influencer: "OfficeHealthCoach",
    platform: "YouTube"
  },

  {
    content: "Claim: Drinking green tea aids in weight loss by boosting metabolism.",
    influencer: "GreenTeaAdvocate",
    platform: "YouTube"
  },
  {
    content: "Claim: Matcha tea contains more antioxidants than regular green tea.",
    influencer: "GreenTeaAdvocate",
    platform: "Blog"
  },
  {
    content: "Claim: Drinking herbal teas helps in relaxation and better sleep.",
    influencer: "GreenTeaAdvocate",
    platform: "Instagram"
  },

  {
    content: "Claim: Consuming turmeric reduces inflammation in the body.",
    influencer: "AyurvedaExpert",
    platform: "Instagram"
  },
  {
    content: "Claim: Aloe vera juice detoxifies the digestive system.",
    influencer: "AyurvedaExpert",
    platform: "YouTube"
  },
  {
    content: "Claim: Eating amla improves vitamin C levels naturally.",
    influencer: "AyurvedaExpert",
    platform: "Blog"
  },

  {
    content: "Claim: Intermittent fasting improves mental clarity and focus.",
    influencer: "FastingFanatic",
    platform: "Podcast"
  },
  {
    content: "Claim: Extended fasting can promote cellular repair.",
    influencer: "FastingFanatic",
    platform: "Twitter"
  },

  {
    content: "Claim: Eating dark chocolate daily reduces the risk of heart disease.",
    influencer: "HeartHealthDaily",
    platform: "Blog"
  },
  { content: "Claim: Omega-3 fatty acids improve brain health.", influencer: "HeartHealthDaily", platform: "YouTube" },

  {
    content: "Claim: Detox juices cleanse toxins from your liver and kidneys.",
    influencer: "DetoxGuru",
    platform: "YouTube"
  },
  { content: "Claim: Drinking lemon water boosts metabolism.", influencer: "DetoxGuru", platform: "Instagram" },

  {
    content: "Claim: Taking probiotics improves gut health and digestion.",
    influencer: "GutHealthPro",
    platform: "Instagram"
  },

  {
    content: "Claim: Eating spinach boosts iron levels and prevents anemia.",
    influencer: "PlantBasedCoach",
    platform: "Blog"
  },
  { content: "Claim: Leafy greens improve skin health.", influencer: "PlantBasedCoach", platform: "YouTube" },
  {
    content: "Claim: Whole grains reduce the risk of chronic diseases.",
    influencer: "PlantBasedCoach",
    platform: "Podcast"
  },

  {
    content: "Claim: Vitamin D improves bone density and reduces osteoporosis risk.",
    influencer: "BoneHealthCoach",
    platform: "Instagram"
  },
  {
    content: "Claim: Consuming fortified milk improves calcium levels.",
    influencer: "BoneHealthCoach",
    platform: "Twitter"
  },

  {
    content: "Claim: Meditation reduces anxiety and stress effectively.",
    influencer: "MindfulnessGuru",
    platform: "Instagram"
  },
  { content: "Claim: Yoga improves sleep quality.", influencer: "MindfulnessGuru", platform: "Facebook" },

  {
    content: "Claim: Running daily improves cardiovascular health significantly.",
    influencer: "CardioCoach",
    platform: "Twitter"
  },
  { content: "Claim: Regular cardio increases stamina.", influencer: "CardioCoach", platform: "YouTube" },

  {
    content: "Claim: Smoking cessation improves lung capacity within weeks.",
    influencer: "QuitSmokingExpert",
    platform: "Facebook"
  },

  {
    content: "Claim: Drinking coffee reduces the risk of Parkinson’s disease.",
    influencer: "CoffeeFacts",
    platform: "Blog"
  },
  {
    content: "Claim: Coffee contains antioxidants that improve focus.",
    influencer: "CoffeeFacts",
    platform: "Twitter"
  },
  { content: "Claim: Drinking black coffee improves digestion.", influencer: "CoffeeFacts", platform: "Instagram" },

  { content: "Claim: Eating blueberries improves memory.", influencer: "BrainBoostingTips", platform: "YouTube" },

  { content: "Claim: Regular yoga practice cures chronic back pain.", influencer: "YogaDaily", platform: "YouTube" },
  { content: "Claim: Yoga can reduce menstrual cramps.", influencer: "YogaDaily", platform: "Blog" },

  {
    content: "Claim: Coconut oil is a superfood that boosts brain function.",
    influencer: "NaturalLivingExpert",
    platform: "Twitter"
  },

  { content: "Claim: Vitamin C serums improve skin elasticity.", influencer: "SkincareSecrets", platform: "Instagram" },
  {
    content: "Claim: Regular moisturizing prevents premature aging.",
    influencer: "SkincareSecrets",
    platform: "Facebook"
  }
]

// Seeder Function
const seedDatabase = async () => {
  try {
    await Influencer.deleteMany({})
    await Claim.deleteMany({})

    for (const claimData of staticClaims) {
      let influencer = await Influencer.findOne({ name: claimData.influencer })

      if (!influencer) {
        influencer = await Influencer.create({
          name: claimData.influencer,
          platform: claimData.platform,
          handle: `@${claimData.influencer.replace(/\s+/g, "").toLowerCase()}`,
          followerCount: Math.floor(Math.random() * 10000) + 1000,
          trustScore: 0,
          claimStats: { totalClaims: 0, verifiedClaims: 0, questionableClaims: 0, debunkedClaims: 0 }
        })
      }

      await Claim.create({
        influencerId: influencer._id,
        content: claimData.content,
        platform: claimData.platform,
        category: "Unknown",
        verificationStatus: "Pending",
        confidenceScore: 0
      })

      influencer.claimStats.totalClaims += 1
      await influencer.save()
    }

    console.log("Database seeded successfully!")
    return true
  } catch (error) {
    console.error("Error seeding database:", error)
    return false
  }
}

export default {
  seedDatabase
}
