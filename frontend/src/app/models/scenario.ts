export interface Question {
  phrase: string;
  b64_phrase: string;
}

export interface Scenario {
  trigger: string;
  questions: Question[];
}
