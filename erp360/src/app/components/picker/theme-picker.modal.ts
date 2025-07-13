import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-theme-picker-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header mode="ios" [translucent]="true">
      <ion-toolbar color="primary">
        <ion-title>Seleccionar color primario</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="4" *ngFor="let color of colors">
            <ion-button
              mode="ios"
              fill="clear"
              expand="block"
              [style.background]="color"
              (click)="changeTheme(color)">
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class ThemePickerModalComponent {
  colors = ['#0054e9', '#0cd1e8', '#10dc60', '#ffce00', '#f04141', '#7044ff'];

  constructor(private modalCtrl: ModalController) { }

  changeTheme(color: string) {
    document.documentElement.style.setProperty('--ion-color-primary', color);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
