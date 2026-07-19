import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Drink } from '../../models/drink.model';
import { ConfigService } from '../../services/config.service';
import { DrinksService } from '../../services/drinks.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  private readonly drinksService = inject(DrinksService);
  // Injected so the component/template can read theming (e.g. via configService.colors())
  // even though this page doesn't apply theme itself — ThemeService owns that.
  private readonly configService = inject(ConfigService);
  private readonly router = inject(Router);

  // Signals drive the template directly; OnPush + signals means no manual
  // change detection (no markForCheck) is needed when these update.
  readonly drinks = signal<Drink[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.drinksService.getAlcoholicDrinks().subscribe({
      next: (data) => {
        this.drinks.set(data);
        this.loading.set(false);
      },
      // Note: getAlcoholicDrinks() currently swallows HTTP errors internally
      // and resolves with [], so this branch won't fire until that's changed.
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  // Passes the drink id as a query param rather than a route param, per the prompt spec.
  openDetail(drink: Drink): void {
    this.router.navigate(['/details'], { queryParams: { id: drink.idDrink } });
  }
}
