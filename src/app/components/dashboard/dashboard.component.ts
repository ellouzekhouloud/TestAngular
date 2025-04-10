import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  stats: any = {};
  produitsParFamille: any = {};
  produitsParFournisseur: Record<string, number> = {};
  
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Produits par Fournisseur', backgroundColor: '#0d6efd' }
    ]
  };
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Produits par Fournisseur' }
    }
  };


  pieChartLabels: string[] = [];
pieChartData: ChartData<'pie'> = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1'] 
    }
  ]
};
pieChartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Produits par Famille' }
  }
};

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe(data => {
      this.stats = data;
    });

    this.dashboardService.getProduitsParFamille().subscribe(data => {
      this.produitsParFamille = data;
    
      
      this.pieChartLabels = Object.keys(data);
      const values = Object.values(data) as number[];
    
      this.pieChartData = {
        labels: this.pieChartLabels,
        datasets: [
          {
            data: values,
            backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1']
          }
        ]
      };
    });

    this.dashboardService.getProduitsParFournisseur().subscribe(data => {
      this.produitsParFournisseur = data;
    
    
      this.barChartLabels = Object.keys(data);
      const values = Object.values(data) as number[];
    
      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [
          {
            data: values,
            label: 'Produits',
            backgroundColor: '#198754'
          }
        ]
      };
    });
  }
}
