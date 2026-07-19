import { Injectable } from '@angular/core';
import { DrinkDetail, Ingredient } from '../models/drink.model';

@Injectable({
  providedIn: 'root',
})
export class DrinksService {
  /**
   * Flattens a DrinkDetail's indexed strIngredient{N}/strMeasure{N} fields
   * into a clean array, stopping at the first missing/null ingredient slot.
   */
  getIngredients(drink: DrinkDetail): Ingredient[] {
    const ingredients: Ingredient[] = [];
    let index = 1;

    while (drink[`strIngredient${index}`]) {
      const ingredient = drink[`strIngredient${index}`];
      const measure = drink[`strMeasure${index}`];

      // Guard against blank/whitespace-only ingredient names from the API.
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure?.trim() || undefined,
        });
      }
      index++;
    }

    return ingredients;
  }
}
