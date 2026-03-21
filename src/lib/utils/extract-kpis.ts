import { ResumeData } from '@/types/resume';

export interface KPIMetric {
  value: string;
  context: string;
}

/**
 * Extracts quantitative metrics (dollars, percentages, multipliers) from a resume's
 * experience and project bullets to populate the top KPI dashboard.
 */
export function extractKPIs(data: ResumeData): KPIMetric[] {
  const bullets: string[] = [];

  // Gather all bullets from experience
  if (data.experience) {
    data.experience.forEach(exp => {
      if (exp.bullets) {
        bullets.push(...exp.bullets);
      }
    });
  }

  // Gather all descriptions from projects
  if (data.projects) {
    data.projects.forEach(proj => {
      if (proj.description) {
        // Simple sentence splitting to treat project description parts as bullets
        bullets.push(...proj.description.split('. '));
      }
    });
  }

  const kpis: KPIMetric[] = [];
  
  // Regex combinations to find metrics:
  // 1. Dollar amounts: $5M, $100K, $500,000, 2M KRW
  // 2. Percentages: 40%, 15.5%
  // 3. Multipliers: 10x, 2x
  // 4. Large raw numbers associated with users/requests: 100K+ users, 1M requests
  
  // Combining into a single execution for simplicity:
  const metricRegex = /(\$?\d+(?:,\d{3})*(?:\.\d+)?[kKmMbB]?\+?%?|\d+[xX])/g;

  for (const bullet of bullets) {
    if (!bullet.trim()) continue;

    const matches = bullet.match(metricRegex);
    
    if (matches && matches.length > 0) {
      // Find the most prominent/largest metric in the sentence if multiple exist
      // For now, take the first one that has a special character ($, %, x)
      let bestMatch = matches[0];
      for (const match of matches) {
        if (match.includes('$') || match.includes('%') || match.toLowerCase().includes('x')) {
          bestMatch = match;
          break;
        }
      }

      // Context extraction: try to grab the 4-6 words around the metric to explain what it is
      // Strip the exact metric out of the bullet to get surrounding text
      let context = bullet.replace(bestMatch, '').trim();
      
      // Clean up context to make it short (5-7 words max) for the UI
      // Example: 'Increased revenue by $5M in Q3' -> '$5M', 'Increased revenue by in Q3'
      // We will try to make this readable
      const words = context.split(' ').filter(w => w.length > 0);
      
      // Take up to 6 words that provide context
      let shortContext = words.slice(0, 6).join(' ');
      if (words.length > 6) shortContext += '...';

      // Capitalize first letter
      shortContext = shortContext.charAt(0).toUpperCase() + shortContext.slice(1);
      
      // Clean up stray punctuation
      shortContext = shortContext.replace(/^[-,.;:!]+|[-,.;:!]+$/g, '').trim();

      // Ensure we don't add duplicate context strings
      if (!kpis.some(k => k.context === shortContext || k.value === bestMatch)) {
         kpis.push({
           value: bestMatch,
           context: shortContext
         });
      }
    }
  }

  // Fallbacks if no metrics were found
  if (kpis.length === 0) {
    const defaultKPIs: KPIMetric[] = [];
    if (data.experience && data.experience.length > 0) {
      defaultKPIs.push({ value: `${data.experience.length}`, context: 'Roles Held' });
    }
    if (data.projects && data.projects.length > 0) {
      defaultKPIs.push({ value: `${data.projects.length}`, context: 'Projects Shipped' });
    }
    
    // Calculate total years of experience roughly
    if (data.experience && data.experience.length > 0) {
       const firstExp = data.experience[data.experience.length - 1].startDate;
       if (firstExp) {
         const yearMatch = firstExp.match(/\d{4}/);
         if (yearMatch) {
            const startYear = parseInt(yearMatch[0]);
            const currentYear = new Date().getFullYear();
            const yoe = Math.max(1, currentYear - startYear);
            defaultKPIs.push({ value: `${yoe}+`, context: 'Years Experience' });
         }
       }
    }
    
    return defaultKPIs;
  }

  // Return the top 4 KPIs (sorting by visual impact is hard with strings, so we take the first 4)
  // Usually users put best stuff at the top of their resume
  return kpis.slice(0, 4);
}
