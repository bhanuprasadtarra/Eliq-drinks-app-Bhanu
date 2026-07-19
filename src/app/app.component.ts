import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ConfigService } from './services/config.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly configService = inject(ConfigService);
  private readonly themeService = inject(ThemeService);
  // Injected for future route-level bootstrapping (e.g. redirect logic); unused for now.
  private readonly router = inject(Router);

  ngOnInit(): void {
    // Load the base theme config once at app startup, before any page renders.
    this.configService.loadConfig('assets/config.json').subscribe({
      next: () => {
        console.log('Config loaded successfully');
        // ThemeService.applyTheme() also re-runs automatically via its own effect()
        // whenever configService.colors() changes, but calling it here applies the
        // theme immediately rather than waiting for the next change-detection tick.
        this.themeService.applyTheme();
      },
      error: (err) => console.error('Failed to load config', err),
    });
  }
}
