export interface Question {
  phrase: string;
  b64Phrase: string;
}

export interface Scenario {
  trigger: string;
  questions: Question[];
}