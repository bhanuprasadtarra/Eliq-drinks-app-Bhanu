/** List item from TheCocktailDB's /filter.php?a=Alcoholic endpoint. */
export interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
}

/** Detail response from TheCocktailDB's /lookup.php?i={id} endpoint. */
export interface DrinkDetail extends Drink {
  strCategory: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  strInstructionsES?: string;
  strInstructionsDE?: string;
  strInstructionsFR?: string;
  strInstructionsIT?: string;
  'strInstructionsZH-HANS'?: string;
  'strInstructionsZH-HANT'?: string;
  /** Captures the dynamic strIngredient{N}/strMeasure{N} fields; unused slots come back as null. */
  [key: string]: string | null | undefined;
}

/** Single ingredient/measure pair, derived from a DrinkDetail's indexed fields. */
export interface Ingredient {
  name: string;
  measure?: string;
}

/** Generic wrapper matching TheCocktailDB's `{ drinks: [...] }` response shape. */
export interface ApiResponse<T> {
  drinks: T[];
}
