import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Chart } from 'chart.js';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.css']
})
export class DashboardChartComponent implements AfterViewInit {
  @Input() fournisseurs: string[] = [];
  @Input() quantitesReceptionnees: number[] = [];
  @Input() quantitesNonConformes: number[] = [];
  chart: any;
  menuOpen = false;

  @Input() startDate!: string;
@Input() endDate!: string;

@Output() startDateChange = new EventEmitter<string>();
@Output() endDateChange = new EventEmitter<string>();
  
  @Input() typePeriode!: string;
@Input() dateFiltre!: string;
@Output() typePeriodeChange = new EventEmitter<string>();
@Output() dateFiltreChange = new EventEmitter<string>();
@Output() filterChanged = new EventEmitter<void>();
  toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

  ngAfterViewInit() {
    this.createChart();
  }

    ngOnChanges() {
    if (this.chart) {
      this.chart.data.labels = this.fournisseurs;
      this.chart.data.datasets[0].data = this.quantitesReceptionnees;
      this.chart.data.datasets[1].data = this.quantitesNonConformes;
      this.chart.update();
    }
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('dashboardChart', {
      type: 'bar',
      data: {
        labels: this.fournisseurs,
        datasets: [
          {
            label: 'Quantité Réceptionnée',
            data: this.quantitesReceptionnees,
            backgroundColor: 'rgba(0, 143, 251, 1)', // ✅ Couleur bleue
            borderRadius: 5,
            barThickness: 15, // ✅ Épaisseur des barres (réduit pour plus fin)
          },
          {
            label: 'Quantité Non Conforme',
            data: this.quantitesNonConformes,
            backgroundColor: 'rgb(200, 63, 0)', // ✅ Couleur rouge
            borderRadius:5,
            barThickness: 15, // ✅ Épaisseur des barres (réduit pour plus fin)
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fournisseurs',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Quantités',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  downloadCSV() {
  const headers = ['Fournisseur', 'Quantité Réceptionnée', 'Quantité Non Conforme'];
  const rows = this.fournisseurs.map((fournisseur, i) => [
    fournisseur,
    this.quantitesReceptionnees[i] ?? 0,
    this.quantitesNonConformes[i] ?? 0,
  ]);

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += headers.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'quantites_par_fournisseur.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
downloadExcel() {
  const worksheetData = this.fournisseurs.map((fournisseur, index) => {
    return {
      'Fournisseur': fournisseur,
      'Quantité Réceptionnée': this.quantitesReceptionnees[index] || 0,
      'Quantité Non Conforme': this.quantitesNonConformes[index] || 0
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  FileSaver.saveAs(blob, 'quantites_par_fournisseur.xlsx');
}

}