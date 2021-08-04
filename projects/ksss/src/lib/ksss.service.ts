import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersistanceService } from './persistance.service';

@Injectable({ providedIn: 'root' })
export class SimpleStateService {
  private readonly state: { [key: string]: BehaviorSubject<unknown> } = {};

  /**
   * Sync method to get the value of a given property.
   */
  getProperty(key: string): unknown {
    return this.state[key]?.getValue();
  }

  /**
   * Async meethod to get the value of a given property.
   * When the defaultValue is passed, it's used as first value to be set end emitted.
   */
  watchProperty(key: string, defaultValue?: unknown): Observable<unknown> {
    const persistedValue = PersistanceService.get(key);

    if (!this.state[key]) {
      this.state[key] = new BehaviorSubject<unknown>(
        typeof persistedValue !== 'undefined' && persistedValue != null
          ? persistedValue
          : defaultValue
      );
    }

    return this.state[key].asObservable();
  }

  /**
   * Sets the value of a property.
   * If persist is true, the property is saved in the sessionStorage or in a cookie accordingly the browser support.
   */
  setProperty(key: string, value: unknown, persist = false): void {
    if (this.state[key]) {
      this.state[key].next(value);
    } else {
      this.state[key] = new BehaviorSubject<unknown>(value);
    }

    if (persist) {
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }

      PersistanceService.set(key, String(value));
    }
  }

  /**
   * Deletes a property from the memory and from the persisted storage.
   */
  unsetProperty(key: string): void {
    if (this.state[key]) {
      this.state[key].next(undefined);
      PersistanceService.unset(key);
    }
  }
}
