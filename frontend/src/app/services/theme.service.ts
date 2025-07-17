// src/app/core/theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private dark = localStorage.getItem('theme') === 'dark';

  constructor() {
    this.apply();
  }

  /** Retorna se o modo atual é dark */
  isDark(): boolean {
    return this.dark;
  }

  /** Alterna entre claro/escuro */
  toggle(): void {
    this.dark = !this.dark;
    localStorage.setItem('theme', this.dark ? 'dark' : 'light');
    this.apply();

    // dispara evento global para notificar componentes
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: this.dark }));
  }

  /** Força um tema específico (opcional) */
  setDark(value: boolean): void {
    this.dark = value;
    localStorage.setItem('theme', this.dark ? 'dark' : 'light');
    this.apply();
  }

  /** Aplica a classe `.dark` no <html> */
  private apply(): void {
    const html = document.documentElement; // <html>
    html.classList.toggle('dark', this.dark);
  }
}
