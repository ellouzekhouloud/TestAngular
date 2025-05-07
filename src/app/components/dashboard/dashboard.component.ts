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

  chargeTotalParPersonnel: Record<string, number> = {};
chargeChartLabels: string[] = [];
chargeChartData: ChartData<'bar'> = {
  labels: [],
  datasets: []
};
  
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

 // === Données pour Charge horaire des personnels ===
 chargeChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: { display: true },
    title: { display: true, text: 'Charge Totale des Personnels' },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const totalMinutes = tooltipItem.raw as number;
          const h = Math.floor(totalMinutes / 60);
          const min = totalMinutes % 60;
          return `${tooltipItem.label}: ${h}h ${min}min`;
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        callback: function(value) {
          return value + ' min'; // Plus besoin de conversion
        }
      },
      title: {
        display: true,
        text: 'Temps en minutes'
      }
    }
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
            backgroundColor: '#198754',
            barThickness: 40 
          }
        ]
      };
    });
    // Charge horaire des personnels
    this.dashboardService.getTempsTotalParPersonnel().subscribe(data => {
      const processedData: Record<string, number> = {};
      const labels: string[] = [];
      const values: number[] = [];
    
      for (const [nom, tempsStr] of Object.entries(data)) {
        // data: { "Naima": "0h 1min", "Hamdi": "0h 10min" }
        const match = tempsStr.match(/(\d+)h\s*(\d+)min/);
        if (match) {
          const heures = parseInt(match[1], 10);
          const minutes = parseInt(match[2], 10);
          const totalMinutes = heures * 60 + minutes;
    
          processedData[nom] = totalMinutes;
          labels.push(nom);
          values.push(totalMinutes);
        }
      }
    
      this.chargeTotalParPersonnel = processedData;
      this.chargeChartLabels = labels;
      this.chargeChartData = {
        labels: labels,
        datasets: [
          {
            data: values,
            label: 'Charge Totale (en minutes)',
            backgroundColor: '#4154f1',
            hoverBackgroundColor: '#4154f1',
            borderColor: '#4154f1',
            hoverBorderColor: '#4154f1',
            barThickness: 40 
          }
        ]
      };
    });
  }


}

