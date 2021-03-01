/**
 * object の各 propety を undefined を許容しない型にする
 * `pbts` は `{ hoge?: (T|null) }` のような型を出力するが、 `?` が付いていると色々と面倒なので消す
 *
 * @example
 * interface A {
 *   hoge?: string;
 *   fuga?: {
 *     foo?: number | null;
 *     bar?: string[];
 *   }
 * }
 * DropUndefined<A> = {
 *   hoge: string;
 *   fuga: {
 *       foo: number | null;
 *       bar: string[];
 *   };
 * }
 */
export type DropUndefined<T> = T extends undefined
    ? never
    : {
          [P in keyof T]-?: T[P] extends undefined
              ? never
              : DropUndefined<T[P]>;
      };
