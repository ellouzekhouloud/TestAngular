import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChargeTrackerService {

  private readonly CHARGE_ID_KEY = 'currentChargeId';
  private readonly PERSONNEL_ID_KEY = 'personnelId';

  constructor() {}

  // 🔹 Enregistrer un id de charge
  setChargeId(id: number, storageType: 'local' | 'session' = 'local'): void {
    if (storageType === 'local') {
      localStorage.setItem(this.CHARGE_ID_KEY, id.toString());
      console.log("✅ Charge ID enregistré dans localStorage :", id);
    } else {
      sessionStorage.setItem(this.CHARGE_ID_KEY, id.toString());
      console.log("✅ Charge ID enregistré dans sessionStorage :", id);
    }
  }

  // 🔹 Récupérer l’id de charge
  getChargeId(): number | null {
    // Vérification dans localStorage
    let id = localStorage.getItem(this.CHARGE_ID_KEY);
    if (id) {
      console.log("✅ Charge ID trouvé dans localStorage :", id);
      return Number(id);
    }

    // Vérification dans sessionStorage si non trouvé
    id = sessionStorage.getItem(this.CHARGE_ID_KEY);
    if (id) {
      console.log("✅ Charge ID trouvé dans sessionStorage :", id);
      return Number(id);
    }

    console.warn("⚠️ Aucun Charge ID trouvé ni dans localStorage, ni dans sessionStorage");
    return null;
  }

  // 🔹 Supprimer l’id de charge
  clearChargeId(): void {
    localStorage.removeItem(this.CHARGE_ID_KEY);
    sessionStorage.removeItem(this.CHARGE_ID_KEY);
    console.log("🗑️ Charge ID supprimé des deux stockages");
  }

  // 🔹 Enregistrer l’id du personnel
  setPersonnelId(id: number, storageType: 'local' | 'session' = 'local'): void {
    if (storageType === 'local') {
      localStorage.setItem(this.PERSONNEL_ID_KEY, id.toString());
      console.log("✅ ID enregistré dans localStorage :", id);
    } else {
      sessionStorage.setItem(this.PERSONNEL_ID_KEY, id.toString());
      console.log("✅ ID enregistré dans sessionStorage :", id);
    }
  }

  // 🔹 Récupérer l’id du personnel
  getPersonnelId(): number | null {
    // 1️⃣ Vérification dans localStorage
    let id = localStorage.getItem(this.PERSONNEL_ID_KEY);
    if (id) {
      console.log("✅ ID trouvé dans localStorage :", id);
      return Number(id);
    }
  
    // 2️⃣ Si non trouvé, on vérifie dans sessionStorage
    id = sessionStorage.getItem(this.PERSONNEL_ID_KEY);
    if (id) {
      console.log("✅ ID trouvé dans sessionStorage :", id);
      return Number(id);
    }
  
    console.warn("⚠️ Aucun ID trouvé ni dans localStorage, ni dans sessionStorage");
    return null;
  }

  // 🔹 Nettoyer tout (par exemple à la déconnexion)
  clearAll(): void {
    localStorage.removeItem(this.CHARGE_ID_KEY);
    localStorage.removeItem(this.PERSONNEL_ID_KEY);
    sessionStorage.removeItem(this.CHARGE_ID_KEY);
    sessionStorage.removeItem(this.PERSONNEL_ID_KEY);
  }
}
