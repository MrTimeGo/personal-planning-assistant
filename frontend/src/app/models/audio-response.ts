export interface AudioResponse<T> {
  b64_phrase: string;
  phrase: string;
  body: T;
}
