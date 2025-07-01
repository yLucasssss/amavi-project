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

    const dropdowns = document.querySelectorAll('.dropdown-header');
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', () => {
        dropdown.parentElement?.classList.toggle('open');
      });
    });
  }

  logout() {
    this.authService.logout();
  }

}
