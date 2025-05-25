import { AfterViewInit, Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.css']
})
export class DashboardChartComponent implements AfterViewInit, OnChanges {
  @Input() fournisseurs: string[] = [];
  @Input() quantitesReceptionnees: number[] = [];
  @Input() quantitesNonConformes: number[] = [];

  chart: any;
  menuOpen = false;

  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() typePeriode!: string;
  @Input() dateFiltre!: string;

  @Output() startDateChange = new EventEmitter<string>();
  @Output() endDateChange = new EventEmitter<string>();
  @Output() typePeriodeChange = new EventEmitter<string>();
  @Output() dateFiltreChange = new EventEmitter<string>();
  @Output() filterChanged = new EventEmitter<void>();

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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
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
            backgroundColor: 'rgba(0, 143, 251, 1)',
            borderRadius: 5,
            barThickness: 15,
          },
          {
            label: 'Quantité Non Conforme',
            data: this.quantitesNonConformes,
            backgroundColor: 'rgb(200, 63, 0)',
            borderRadius: 5,
            barThickness: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: { enabled: true },
        },
        scales: {
          x: { title: { display: true, text: 'Fournisseurs' } },
          y: { title: { display: true, text: 'Quantités' }, beginAtZero: true },
        },
      },
    });
  }

  downloadExcel() {
    const worksheetData = this.fournisseurs.map((fournisseur, index) => ({
      'Fournisseur': fournisseur,
      'Quantité Réceptionnée': this.quantitesReceptionnees[index] || 0,
      'Quantité Non Conforme': this.quantitesNonConformes[index] || 0,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'quantites_par_fournisseur.xlsx');
  }

  // Quand on modifie la période personnalisée
  onCustomDateChange() {
    if (this.startDate && this.endDate) {
      this.typePeriode = 'custom';
      this.typePeriodeChange.emit(this.typePeriode);
      this.startDateChange.emit(this.startDate);
      this.endDateChange.emit(this.endDate);
      this.filterChanged.emit();
    }
  }

  // Quand on modifie le filtre standard (mois, trimestre, semestre, année)
  onStandardFilterChange() {
    if (this.typePeriode && this.dateFiltre) {
      this.startDate = '';
      this.endDate = '';
      this.startDateChange.emit(this.startDate);
      this.endDateChange.emit(this.endDate);

      this.typePeriodeChange.emit(this.typePeriode);
      this.dateFiltreChange.emit(this.dateFiltre);
      this.filterChanged.emit();
    }
  }
}
