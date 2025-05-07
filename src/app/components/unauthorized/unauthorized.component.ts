import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 
import { NavigationService } from 'src/app/services/navigation.service';
@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {
  constructor(private router: Router, private navigationService: NavigationService) {}

  ngOnInit(): void {
    setTimeout(() => {
      const prevUrl = this.navigationService.getPreviousUrl();
      if (prevUrl) {
        this.router.navigateByUrl('/unauthorized', { replaceUrl: true });
      } else {
        this.router.navigate(['/']); // fallback vers l'accueil
      }
    }, 3000);
  }
}
