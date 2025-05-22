import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-controleur',
  templateUrl: './controleur.component.html',
  styleUrls: ['./controleur.component.css']
})
export class ControleurComponent implements OnInit{
constructor(private router: Router) {}

   ngOnInit(): void {
    const role = localStorage.getItem('role') || sessionStorage.getItem('role');

    setTimeout(() => {
      if (role === 'RESPONSABLE_RECEPTION') {
        this.router.navigate(['/addBL']);
      } else if (role === 'CONTROLEUR') {
        this.router.navigate(['/ListBL']);
      } else {
        this.router.navigate(['/login']);
      }
    }, 2000); // 3 secondes
  }

}
