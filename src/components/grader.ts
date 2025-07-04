// Lexical similarity: compare sets of words, ignoring order and minor differences.
// Score is based on the overlap of unique words (Jaccard similarity).
// Hybrid grading: combines Jaccard, BLEU, and fuzzy token sort ratio for more human-like grading.
export function gradeTranslation(ai: string, user: string): number {
  if (!ai || !user) return 0;
  // Jaccard: word overlap
  const jaccard = jaccardSimilarity(ai, user);
  // BLEU: n-gram and order
  const bleu = bleuScore(ai, user);
  // Fuzzy: token sort ratio (order-insensitive, typo-tolerant)
  const fuzzy = tokenSortRatio(ai, user);
  // Weighted average: Jaccard (20%), BLEU (20%), Fuzzy (60%)
  let score = 0.2 * jaccard + 0.2 * bleu + 0.6 * fuzzy;
  // For short sentences, if Jaccard is high, boost score
  const aiLen = tokenizeSet(ai).size;
  const userLen = tokenizeSet(user).size;
  if (Math.min(aiLen, userLen) <= 6 && jaccard >= 60 && fuzzy >= 50) {
    score = Math.max(score, (jaccard + fuzzy) / 2);
  }
  return Math.round(score);

// Token sort ratio: like fuzzywuzzy, sorts tokens and computes normalized Levenshtein similarity
function tokenSortRatio(a: string, b: string): number {
  const sortTokens = (s: string) =>
    s
      .toLowerCase()
      .replace(/[.,!?;:()\[\]{}"'`~\-]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .sort()
      .join(' ');
  const sa = sortTokens(a);
  const sb = sortTokens(b);
  return levenshteinRatio(sa, sb);
}

// Levenshtein ratio: 100 for identical, 0 for completely different
function levenshteinRatio(a: string, b: string): number {
  if (a === b) return 100;
  const m = a.length, n = b.length;
  if (m === 0 || n === 0) return 0;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  const dist = dp[m][n];
  const maxLen = Math.max(m, n);
  return Math.round((1 - dist / maxLen) * 100);
}
}

export function jaccardSimilarity(ai: string, user: string): number {
  if (!ai || !user) return 0;
  const aiWords = tokenizeSet(ai);
  const userWords = tokenizeSet(user);
  if (aiWords.size === 0 && userWords.size === 0) return 100;
  const intersection = new Set([...aiWords].filter(x => userWords.has(x)));
  const union = new Set([...aiWords, ...userWords]);
  const score = (intersection.size / union.size) * 100;
  return Math.round(score);
}

// BLEU score implementation (unigram and bigram, brevity penalty)
export function bleuScore(reference: string, candidate: string): number {
  const refTokens = tokenizeArray(reference);
  const candTokens = tokenizeArray(candidate);
  if (refTokens.length === 0 && candTokens.length === 0) return 100;
  if (candTokens.length === 0) return 0;

  // Unigram precision
  const refUnigrams = new Map<string, number>();
  for (const w of refTokens) refUnigrams.set(w, (refUnigrams.get(w) || 0) + 1);
  let matchUnigrams = 0;
  const candUnigrams = new Map<string, number>();
  for (const w of candTokens) candUnigrams.set(w, (candUnigrams.get(w) || 0) + 1);
  for (const [w, count] of candUnigrams) {
    matchUnigrams += Math.min(count, refUnigrams.get(w) || 0);
  }
  const unigramPrecision = matchUnigrams / candTokens.length;

  // Bigram precision
  function bigrams(tokens: string[]) {
    return tokens.slice(0, -1).map((_, i) => tokens[i] + ' ' + tokens[i + 1]);
  }
  const refBigrams = new Map<string, number>();
  for (const b of bigrams(refTokens)) refBigrams.set(b, (refBigrams.get(b) || 0) + 1);
  let matchBigrams = 0;
  const candBigrams = new Map<string, number>();
  for (const b of bigrams(candTokens)) candBigrams.set(b, (candBigrams.get(b) || 0) + 1);
  for (const [b, count] of candBigrams) {
    matchBigrams += Math.min(count, refBigrams.get(b) || 0);
  }
  const bigramPrecision = candBigrams.size > 0 ? matchBigrams / (candTokens.length - 1) : 0;

  // Brevity penalty
  const bp = candTokens.length > refTokens.length
    ? 1
    : Math.exp(1 - refTokens.length / Math.max(1, candTokens.length));

  // BLEU (unigram and bigram, geometric mean)
  const bleu = bp * Math.exp(
    0.5 * (Math.log(unigramPrecision || 1e-9) + Math.log(bigramPrecision || 1e-9))
  );
  return Math.round(bleu * 100);
}

function tokenizeSet(text: string): Set<string> {
  // Remove punctuation, lowercase, split on whitespace
  return new Set(
    text
      .toLowerCase()
      .replace(/[.,!?;:()\[\]{}"'`~\-]/g, '')
      .split(/\s+/)
      .filter(Boolean)
  );
}

function tokenizeArray(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?;:()\[\]{}"'`~\-]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}
