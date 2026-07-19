import { Location, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DrinkDetail } from '../../models/drink.model';
import { ConfigService } from '../../services/config.service';
import { DrinksService } from '../../services/drinks.service';

// Only these three are supported since TheCocktailDB only provides
// strInstructionsES/strInstructionsFR as translations (besides English).
type Language = 'en' | 'es' | 'fr';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly drinksService = inject(DrinksService);
  // Injected so the template can read theming, as with ListPage.
  private readonly configService = inject(ConfigService);
  private readonly location = inject(Location);

  readonly drink = signal<DrinkDetail | null>(null);
  // Derived from drink(); recomputes automatically whenever drink() changes.
  readonly ingredients = computed(() =>
    this.drink() ? this.drinksService.getIngredients(this.drink()!) : [],
  );
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly language = signal<Language>('en');

  // Instructions text for the currently selected language, falling back to English
  // when the API didn't return a translation for that drink.
  readonly instructions = computed(() => {
    const drink = this.drink();
    if (!drink) return '';
    switch (this.language()) {
      case 'es':
        return drink.strInstructionsES || drink.strInstructions;
      case 'fr':
        return drink.strInstructionsFR || drink.strInstructions;
      default:
        return drink.strInstructions;
    }
  });

  ngOnInit(): void {
    // ListPage navigates here with ?id=..., not a route param, so read it from queryParamMap.
    const drinkId = this.route.snapshot.queryParamMap.get('id');
    if (!drinkId) {
      this.error.set('No drink id provided');
      this.loading.set(false);
      return;
    }

    this.drinksService.getDrinkDetail(drinkId).subscribe({
      next: (data) => {
        this.drink.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load drink details');
        this.loading.set(false);
      },
    });
  }

  // Cycles en -> es -> fr -> en; the instructions() computed signal reacts
  // automatically since it reads language().
  toggleLanguage(): void {
    const order: Language[] = ['en', 'es', 'fr'];
    const next = order[(order.indexOf(this.language()) + 1) % order.length];
    this.language.set(next);
  }

  goBack(): void {
    this.location.back();
  }
}
