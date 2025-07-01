
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardSummary } from '../services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  summary: DashboardSummary = {
    totalProducts: 0,
    totalSoldProducts: 0,
    remainingProducts: 0,
    salesThisMonth: 0
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (err) => {
        console.error('Erro ao buscar resumo do dashboard', err);
      }
    });
  }
}
