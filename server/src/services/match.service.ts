import prisma from '../lib/prisma';
import stringSimilarity from 'string-similarity';

const STOP_WORDS = new Set(['the', 'is', 'at', 'which', 'and', 'on', 'in', 'with', 'a', 'an', 'of', 'for', 'to', 'it', 'my', 'i', 'lost', 'found', 'this', 'that']);

/**
 * Normalizes text by lowercasing, removing punctuation, and trimming.
 */
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .trim();
}

/**
 * Extracts meaningful tokens (words) from a string, ignoring stop words.
 */
function getTokens(text: string): string[] {
  const words = text.split(/\s+/);
  return words.filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Match Service — finds potential matches between lost and found items.
 */
export class MatchService {
  /**
   * Find potential matches for a given item based on category and keywords.
   */
  async findMatches(itemId: string) {
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return [];

    const oppositeStatus = item.status === 'LOST' ? 'FOUND' : 'LOST';

    // Fetch potential candidates based on category
    const candidates = await prisma.item.findMany({
      where: {
        category: item.category,
        status: { in: ['LOST', 'FOUND'] }, // Looking generally at items that haven't been resolved
        id: { not: itemId },
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    const evaluatedMatches = candidates
      .filter(candidate => candidate.status === oppositeStatus || oppositeStatus === 'LOST') // Only opposite or we are just searching
      .map(candidate => {
        return {
          item: candidate,
          score: this.calculateScore(item, candidate),
        };
      })
      .filter(match => match.score > 40) // Threshold for a good match
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10

    // Store high confidence matches (> 70) and notify users
    for (const match of evaluatedMatches) {
      if (match.score >= 70) {
        const lostItemId = item.status === 'LOST' ? item.id : match.item.id;
        const foundItemId = item.status === 'FOUND' ? item.id : match.item.id;

        // Check if match already exists
        const existingMatch = await prisma.match.findFirst({
          where: { lostItemId, foundItemId }
        });

        if (!existingMatch) {
          await prisma.match.create({
            data: {
              lostItemId,
              foundItemId,
              score: match.score,
            }
          });

          // Create notification for the user who lost the item
          const lostItem = item.status === 'LOST' ? item : match.item;
          await prisma.notification.create({
            data: {
              type: 'MATCH_FOUND',
              title: 'High Confidence Match Found!',
              message: `We found a potential match for your lost item: ${lostItem.title} (Match Score: ${match.score}%)`,
              userId: lostItem.userId,
              data: {
                matchItemId: item.status === 'LOST' ? match.item.id : item.id,
                score: match.score
              }
            }
          });
        }
      }
    }

    return evaluatedMatches;
  }

  /**
   * Powerful heuristic scoring combining TF-IDF principles, Date, and Geo-Spatial logic.
   * Maximum potential score is 100.
   */
  private calculateScore(source: any, candidate: any): number {
    let finalScore = 0;

    // 1. Text Similarity (Title & Description) - Max Weight: 50%
    const sourceString = `${source.title} ${source.description}`;
    const candidateString = `${candidate.title} ${candidate.description}`;
    
    const normalizedSource = normalizeText(sourceString);
    const normalizedCandidate = normalizeText(candidateString);
    
    // Fallback if totally empty strings
    if (!normalizedSource || !normalizedCandidate) return 0;

    const fuzzyScore = stringSimilarity.compareTwoStrings(normalizedSource, normalizedCandidate);
    
    const sourceTokens = getTokens(normalizedSource);
    const candidateTokens = getTokens(normalizedCandidate);
    let tokenMatchCount = 0;

    // Mini fuzzy token mapper
    if (candidateTokens.length > 0) {
       for (const word of sourceTokens) {
         const match = stringSimilarity.findBestMatch(word, candidateTokens);
         if (match.bestMatch.rating > 0.8) tokenMatchCount++;
       }
    }
    const tokenScore = sourceTokens.length > 0 ? tokenMatchCount / sourceTokens.length : 0;
    
    // We favor Token Match (70%) over literal string fuzzy match (30%) because of phrase rearranging
    const combinedTextFactor = (fuzzyScore * 0.3) + (tokenScore * 0.7);
    finalScore += (combinedTextFactor * 50);

    // 2. Location Proximity Check - Max Weight: 30%
    if (source.latitude && source.longitude && candidate.latitude && candidate.longitude) {
      const distanceKM = this.calculateDistance(
        source.latitude, source.longitude,
        candidate.latitude, candidate.longitude
      );
      if (distanceKM <= 0.5) finalScore += 30;       // < 500m
      else if (distanceKM <= 2.0) finalScore += 22;  // < 2km
      else if (distanceKM <= 5.0) finalScore += 15;  // < 5km
      else if (distanceKM <= 15.0) finalScore += 5;  // < 15km
    } else {
      // If one is missing a map coordinate, we penalize slightly by awarding neutral middle ground
      finalScore += 10;
    }

    // 3. Date Proximity Check - Max Weight: 20%
    // A lost item shouldn't historically have been found BEFORE it was lost theoretically, 
    // but users mess up dates, so we rely on absolute proximity.
    const daysDiff = Math.abs(
      (new Date(source.date).getTime() - new Date(candidate.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff <= 1) finalScore += 20;
    else if (daysDiff <= 3) finalScore += 15;
    else if (daysDiff <= 7) finalScore += 10;
    else if (daysDiff <= 14) finalScore += 5;

    // Minimum constraints. If the text similarity is abysmal, we shouldn't match them even if they happened on the same day in the same park.
    if (combinedTextFactor < 0.25) {
       return 0; // The descriptions have absolutely nothing in common.
    }

    return Math.min(100, Math.round(finalScore));
  }

  /**
   * Haversine distance between two coordinates (in km).
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}

export const matchService = new MatchService();
