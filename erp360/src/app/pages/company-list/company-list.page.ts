// src/app/pages/company-list/company-list.page.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { CompanyCreatePage } from '../company-create/company-create.page';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { ThemePickerModalComponent } from 'src/app/components/picker/theme-picker.modal';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, MenuComponent],
  templateUrl: './company-list.page.html',
  styleUrls: ['./company-list.page.scss'],
})
export class CompanyListPage implements OnInit {
  private companySvc = inject(CompanyService);
  private modalCtrl = inject(ModalController);
  companies: Company[] = [];
  loading = true;
  searchTerm: string = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.currentPage = 1;
    this.loading = true;
    this.companySvc.list().subscribe({
      next: async (companies) => {
        this.companies = companies;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  refresh(event: CustomEvent): void {
    this.companySvc.list().subscribe({
      next: (data) => {
        this.companies = data;
        (event.target as HTMLIonRefresherElement).complete();
      },
      error: () => {
        (event.target as HTMLIonRefresherElement).complete();
      },
    });
  }

  filterCompanies(): Company[] {
    if (!this.searchTerm) return this.companies;
    return this.companies.filter(c => c.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  async openCreateModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CompanyCreatePage,
      cssClass: 'animated-modal',
      mode: 'ios'
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'created') {
      this.loadCompanies();
    }
  }

  formatDate(createdAt: any): string {
    if (!createdAt || typeof createdAt._seconds !== 'number') return 'Fecha inválida';
    const date = new Date(createdAt._seconds * 1000);
    return date.toLocaleDateString('es-CO') + ' ' + date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }


  //Paginación
  get totalPages(): number {
    return Math.ceil(this.filteredCompanies().length / this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  filteredCompanies(): Company[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) return this.companies;

    return this.companies.filter(c => {
      const name = c.name?.toLowerCase() || '';
      const nit = c.nit?.toLowerCase() || '';
      const displayName = c.ownerData?.displayName?.toLowerCase() || '';
      const email = c.ownerData?.email?.toLowerCase() || '';

      return (
        name.includes(term) ||
        nit.includes(term) ||
        displayName.includes(term) ||
        email.includes(term)
      );
    });
  }


  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  get paginatedCompanies(): Company[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCompanies().slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  async openThemeModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ThemePickerModalComponent,
      cssClass: 'animated-modal',
      mode:'ios'
    });
    await modal.present();
  }

}
