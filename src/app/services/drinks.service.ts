import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApiResponse, Drink, DrinkDetail, Ingredient } from '../models/drink.model';

const API_BASE = 'https://www.thecocktaildb.com/api/json/v1/1';

@Injectable({
  providedIn: 'root',
})
export class DrinksService {
  private readonly http = inject(HttpClient);

  // Last-fetched alcoholic drinks list, kept for components that just want the cached value.
  private readonly cachedDrinks = signal<Drink[]>([]);
  // Detail lookups keyed by idDrink, so repeat visits to a drink's page skip the network call.
  private readonly cachedDrinkDetail = signal<Map<string, DrinkDetail>>(new Map());

  getAlcoholicDrinks(): Observable<Drink[]> {
    return this.http.get<ApiResponse<Drink>>(`${API_BASE}/filter.php?a=Alcoholic`).pipe(
      map((res) => res.drinks ?? []),
      tap((drinks) => this.cachedDrinks.set(drinks)),
      catchError((err) => {
        console.error('Failed to load alcoholic drinks', err);
        return of([]);
      }),
    );
  }

  getDrinkDetail(id: string): Observable<DrinkDetail> {
    return this.http.get<ApiResponse<DrinkDetail>>(`${API_BASE}/lookup.php?i=${id}`).pipe(
      map((res) => res.drinks[0]),
      tap((drink) => {
        // Copy-on-write so the signal's identity changes and consumers get notified.
        const next = new Map(this.cachedDrinkDetail());
        next.set(id, drink);
        this.cachedDrinkDetail.set(next);
      }),
      catchError((err) => {
        console.error(`Failed to load drink detail for id ${id}`, err);
        throw err;
      }),
    );
  }

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
