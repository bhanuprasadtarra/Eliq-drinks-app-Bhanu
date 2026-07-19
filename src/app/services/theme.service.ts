import { Injectable, effect, inject, signal } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly configService = inject(ConfigService);

  readonly currentTheme = signal<'light' | 'dark'>('dark');

  constructor() {
    // Reading currentTheme()/colors() here registers them as dependencies, so this
    // effect re-runs (and re-applies the CSS vars) whenever either one changes —
    // covers both toggleTheme() and config reloading with a new palette.
    effect(() => {
      const _ = this.currentTheme();
      const __ = this.configService.colors();
      this.applyTheme();
    });
  }

  // Pushes the config's color palette onto :root as CSS custom properties, so plain
  // CSS/SCSS across the app can reference var(--primary-color) etc. without Angular bindings.
  // Falls back to sensible defaults when a key is missing from the loaded config.
  applyTheme(): void {
    const root = document.documentElement;
    const colors = this.configService.colors();

    // Keys here must match config-dark.json/config-light.json's `colors` shape exactly.
    root.style.setProperty('--primary-color', colors.primary || '#1a1a1a');
    root.style.setProperty('--accent-color', colors.accent || '#00d4ff');
    root.style.setProperty('--bg-color', colors.bgColor || '#ffffff');
    root.style.setProperty('--text-color', colors.textColor || '#1a1a1a');
    root.style.setProperty('--border-color', colors.borderColor || '#e0e0e0');
    root.style.setProperty('--shadow-color', colors.shadowColor || 'rgba(0, 0, 0, 0.1)');
    root.style.setProperty('--border-radius', colors.borderRadius || '8px');
    root.style.setProperty('--font-family', colors.fontFamily || 'system-ui, sans-serif');
  }

  // Flips the theme; applyTheme() is not called directly here since the effect
  // above reacts to currentTheme() and re-applies the CSS vars automatically.
  toggleTheme(): void {
    this.currentTheme.set(this.currentTheme() === 'dark' ? 'light' : 'dark');
  }
}
