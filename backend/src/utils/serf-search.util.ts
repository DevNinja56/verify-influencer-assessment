// import fs from "fs"
import { getJson } from "serpapi"
import config from "../config"

// const SURF_RES_CACHE = "surf-cache.json"

interface SearchResult {
  title: string
  snippet: string
  link: string
  isScientific: boolean
}

export async function searchClaims(
  influencerName: string,
  numberOfClaims: number,
  timeRange: string,
  verifyWithScientificJournals: boolean = false
): Promise<SearchResult[]> {
  try {
    const timeFilter: string | undefined = {
      "Last Week": "w",
      "Last Month": "m",
      "Last Year": "y",
      "All Time": ""
    }[timeRange]

    // TODO 🔴 - remove code for cashing serp api data

    // Check if cache exists and is valid
    // if (fs.existsSync(SURF_RES_CACHE)) {
    //   console.log(`SURF CACHE FOUND WILL PROCESS THAT`)

    //   const cachedData = JSON.parse(fs.readFileSync(SURF_RES_CACHE, "utf8"))
    //   const cacheKey = `${influencerName}_${numberOfClaims}_${timeRange}_${verifyWithScientificJournals}`

    //   if (cachedData[cacheKey]) {
    //     console.log("Returning cached data...")
    //     return cachedData[cacheKey]
    //   }
    // }

    // Base search queries
    let searchQueries: string[] = [
      `${influencerName} medical advice health claims`,
      `${influencerName} health tips recommendations`,
      `${influencerName} medical facts site:youtube.com`,
      `${influencerName} health advice site:instagram.com`,
      `${influencerName} followers count social media`,
      `${influencerName} net worth earnings revenue`,
      `${influencerName} sponsored products endorsements`,
      `${influencerName} business ventures partnerships`,
      `${influencerName} product recommendations reviews`,
      `${influencerName} sponsored products amazon`,
      `${influencerName} affiliate links products`,
      `${influencerName} merchandise store products`,
      `${influencerName} endorsed products reviews`,
      `${influencerName} recommended health products`,
      `${influencerName} product collaborations`
    ]

    // Add scientific journal queries if verification is requested
    if (verifyWithScientificJournals) {
      searchQueries = searchQueries.concat([
        `${influencerName} health claims site:pubmed.ncbi.nlm.nih.gov`,
        `${influencerName} medical research site:scholar.google.com`,
        `${influencerName} health recommendations site:sciencedirect.com`,
        `${influencerName} medical advice site:nejm.org`
      ])
    }

    let allResults: SearchResult[] = []
    const seenUrls: Set<string> = new Set()

    // console.log(`SURF API CALLING`)

    // Execute searches in sequence to maintain control
    for (const query of searchQueries) {
      try {
        const response = await getJson({
          api_key: config.SERP_API.API_KEY,
          q: query,
          num: numberOfClaims,
          ...(timeFilter && { tbs: `qdr:${timeFilter}` })
        })

        if (response.organic_results) {
          response.organic_results.forEach((result: any) => {
            if (!seenUrls.has(result.link)) {
              seenUrls.add(result.link)
              const processedResult: SearchResult = {
                title: result.title?.slice(0, 200) ?? "",
                snippet: result.snippet?.slice(0, 300) ?? "",
                link: result.link,
                isScientific:
                  verifyWithScientificJournals &&
                  (result.link.includes("pubmed.ncbi.nlm.nih.gov") ||
                    result.link.includes("scholar.google.com") ||
                    result.link.includes("sciencedirect.com") ||
                    result.link.includes("nejm.org"))
              }
              allResults.push(processedResult)
            }
          })
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error: any) {
        console.error(`Error searching for query "${query}":`, error.message)
      }
    }

    // Store the results in the cache
    // const cacheData = fs.existsSync(SURF_RES_CACHE) ? JSON.parse(fs.readFileSync(SURF_RES_CACHE, "utf8")) : {}
    // const cacheKey = `${influencerName}_${numberOfClaims}_${timeRange}_${verifyWithScientificJournals}`
    // cacheData[cacheKey] = allResults.slice(0, 15)

    // fs.writeFileSync(SURF_RES_CACHE, JSON.stringify(cacheData, null, 2))

    // console.log(JSON.stringify(allResults))

    return allResults.slice(0, 15)
  } catch (error: any) {
    console.error("Error searching claims:", error.message)
    return []
  }
}
