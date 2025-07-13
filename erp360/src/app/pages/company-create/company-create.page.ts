import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './company-create.page.html',
  styleUrls: ['./company-create.page.scss']
})
export class CompanyCreatePage {
  private companySvc = inject(CompanyService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);

  saving = false;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    nit: ['', Validators.required],
    emailAdmin: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async save(): Promise<void> {
    if (this.form.invalid) return;
    this.saving = true;

    this.companySvc.create(this.form.getRawValue()).subscribe({
      next: async () => {
        this.saving = false;

        const alert = await this.alertCtrl.create({
          header: '¡Empresa creada!',
          message: 'La empresa fue registrada exitosamente.',
          buttons: [
            {
              text: 'Aceptar',
              handler: () => {
                // 🎉 Disparar confeti
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });

                // Cerrar modal y redirigir
                this.modalCtrl.dismiss(null, 'created');
                this.router.navigate(['/companies']);
              }
            }
          ]
        });

        await alert.present();
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  showValidationIcon(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && (control.dirty || control.touched);
  }

  close(): void {
    this.modalCtrl.dismiss();
  }
}
