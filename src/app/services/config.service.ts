import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http = inject(HttpClient);

  // Raw JSON loaded from the active config file (e.g. config-light.json/config-dark.json).
  private readonly configData = signal<any>(null);

  // Derived views over configData; recompute automatically whenever it changes.
  readonly appName = computed(() => this.configData()?.appName || 'DrinksApp');
  readonly colors = computed(() => this.configData()?.colors || {});
  readonly features = computed(() => this.configData()?.features || {});

  /**
   * Fetches the config JSON at `path` and updates configData, so appName/colors/features
   * refresh reactively. Returns Observable<void> so callers can subscribe to know when it's ready
   * without needing the raw payload.
   */
  loadConfig(path: string): Observable<void> {
    return this.http.get<any>(path).pipe(
      tap((data) => this.configData.set(data)),
      map(() => void 0),
    );
  }

  getColor(key: string): string {
    return this.colors()[key];
  }

  getFeature(key: string): any {
    return this.features()[key];
  }
}
