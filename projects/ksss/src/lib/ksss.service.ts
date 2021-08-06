import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersistanceService } from './persistance.service';

@Injectable({ providedIn: 'root' })
export class SimpleStateService {
  private readonly state: { [key: string]: BehaviorSubject<any> } = {};

  /**
   * Sync method to get the value of a given property.
   */
  getProperty<T>(key: string): T {
    return this.state[key]?.getValue() || PersistanceService.get(key);
  }

  /**
   * Async meethod to get the value of a given property.
   * When the defaultValue is passed, it's used as first value to be set end emitted.
   */
  watchProperty<T>(key: string, defaultValue?: T): Observable<T> {
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
  setProperty<T>(key: string, value: T, persist = false): void {
    if (this.state[key]) {
      this.state[key].next(value);
    } else {
      this.state[key] = new BehaviorSubject<T>(value);
    }

    if (persist) {
      let persistable: T | string = value;
      if (typeof value === 'object') {
        persistable = JSON.stringify(value);
      }

      PersistanceService.set(key, String(persistable));
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
