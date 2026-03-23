import prisma from '../lib/prisma';

/**
 * Match Service — finds potential matches between lost and found items.
 * Stub implementation: expand with ML-based matching or keyword analysis.
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

    // Optionally: Store the top matches in the database if score > 70 (high confidence)
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
              message: `We found a potential match for your lost item: ${lostItem.title}`,
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
   * Simple scoring based on matching fields (Text similarity + Date + Location)
   */
  private calculateScore(source: any, candidate: any): number {
    let score = 0;

    // 1. Text Similarity (Title & Description) - Weight: 40
    let textScore = 0;
    const sourceWords = `${source.title} ${source.description}`.toLowerCase().split(/\W+/);
    const candidateWords = `${candidate.title} ${candidate.description}`.toLowerCase().split(/\W+/);
    
    const intersection = sourceWords.filter(word => word.length > 2 && candidateWords.includes(word));
    const union = new Set([...sourceWords, ...candidateWords]);
    
    // Jaccard index for simple text matching
    if (union.size > 0) {
      textScore = (intersection.length / union.size) * 40;
    }
    score += textScore;

    // 2. Location proximity (if both have coordinates) - Weight: 40
    if (source.latitude && source.longitude && candidate.latitude && candidate.longitude) {
      const distance = this.calculateDistance(
        source.latitude, source.longitude,
        candidate.latitude, candidate.longitude
      );
      if (distance <= 0.5) score += 40;      // < 500m
      else if (distance <= 2) score += 30;   // < 2km
      else if (distance <= 10) score += 20;  // < 10km
      else if (distance <= 50) score += 10;  // < 50km
    }

    // 3. Date proximity - Weight: 20
    const daysDiff = Math.abs(
      (new Date(source.date).getTime() - new Date(candidate.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff <= 1) score += 20;
    else if (daysDiff <= 3) score += 15;
    else if (daysDiff <= 7) score += 10;
    else if (daysDiff <= 14) score += 5;

    return Math.min(100, Math.round(score));
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
