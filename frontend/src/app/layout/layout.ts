import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent implements OnInit {

  userName: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();

    const dropdownHeaders = document.querySelectorAll('.dropdown-header');

    dropdownHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const parent = header.parentElement;
        if (!parent) return;

        const wasOpen = parent.classList.contains('open');

        // Fecha todos os dropdowns
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));

        // Se o dropdown clicado não estava aberto, abre ele
        if (!wasOpen) {
          parent.classList.add('open');
        }
        // Se já estava aberto, o passo anterior já o fechou.
      });
    });
  }

  logout() {
    this.authService.logout();
  }

}
