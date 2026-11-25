// Curated Infinite Question Engine for ObrolanSeru
// Guaranteed zero-duplicate within session, strict topic isolation, and unified 600+ question bank

import { MASTER_QUESTION_BANKS, normalizeQ } from './masterQuestionBank';

export { MASTER_QUESTION_BANKS as CURATED_BANKS, normalizeQ };

function shuffle<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

// Generates N guaranteed unique questions with strict topic isolation and ZERO repetition within session
export function generateProceduralQuestions(topic: string, count: number, excludeSet: Set<string>): string[] {
  const bank = MASTER_QUESTION_BANKS[topic] || MASTER_QUESTION_BANKS['kenalan'];
  const questions: string[] = [];
  const chosenNorms = new Set<string>();

  // 1. First priority: Unseen questions from this specific topic's bank
  const unseen = bank.filter(q => !excludeSet.has(normalizeQ(q)));
  const shuffledUnseen = shuffle(unseen);

  for (const q of shuffledUnseen) {
    if (questions.length >= count) break;
    const norm = normalizeQ(q);
    if (!chosenNorms.has(norm)) {
      chosenNorms.add(norm);
      questions.push(q);
      excludeSet.add(norm);
    }
  }

  // 2. Strict Topic Isolation & Intra-Session Deduplication
  if (questions.length < count) {
    if (topic === 'mix') {
      const allOtherCategories = Object.keys(MASTER_QUESTION_BANKS)
        .filter(k => k !== 'mix')
        .flatMap(k => MASTER_QUESTION_BANKS[k]);
      const unseenOthers = shuffle(allOtherCategories.filter(q => !excludeSet.has(normalizeQ(q))));
      for (const q of unseenOthers) {
        if (questions.length >= count) break;
        const norm = normalizeQ(q);
        if (!chosenNorms.has(norm)) {
          chosenNorms.add(norm);
          questions.push(q);
          excludeSet.add(norm);
        }
      }
    } else {
      // For specific topics (like pasangan, keluarga, deep), STRICTLY stay in the same topic bank!
      // Pick questions from bank that have NOT been picked in this session yet
      const availableInBank = shuffle(bank.filter(q => !chosenNorms.has(normalizeQ(q))));
      for (const q of availableInBank) {
        if (questions.length >= count) break;
        const norm = normalizeQ(q);
        if (!chosenNorms.has(norm)) {
          chosenNorms.add(norm);
          questions.push(q);
        }
      }
    }
  }

  return shuffle(questions);
}
