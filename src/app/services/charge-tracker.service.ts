import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChargeTrackerService {

  private readonly CHARGE_ID_KEY = 'currentChargeId';
  private readonly PERSONNEL_ID_KEY = 'personnelId';

  constructor() {}

  // 🔹 Enregistrer un id de charge
  setChargeId(id: number): void {
    localStorage.setItem(this.CHARGE_ID_KEY, id.toString());
  }

  // 🔹 Récupérer l’id de charge
  getChargeId(): number | null {
    const id = localStorage.getItem(this.CHARGE_ID_KEY);
    return id ? Number(id) : null;
  }

  // 🔹 Supprimer l’id de charge
  clearChargeId(): void {
    localStorage.removeItem(this.CHARGE_ID_KEY);
  }

  // 🔹 Enregistrer l’id du personnel
  setPersonnelId(id: number): void {
    localStorage.setItem(this.PERSONNEL_ID_KEY, id.toString());
  }

  // 🔹 Récupérer l’id du personnel
  getPersonnelId(): number | null {
    const id = localStorage.getItem(this.PERSONNEL_ID_KEY);
    return id ? Number(id) : null;
  }

  // 🔹 Nettoyer tout (par exemple à la déconnexion)
  clearAll(): void {
    localStorage.removeItem(this.CHARGE_ID_KEY);
    localStorage.removeItem(this.PERSONNEL_ID_KEY);
  }
}
