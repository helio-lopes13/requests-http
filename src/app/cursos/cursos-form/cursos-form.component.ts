import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CursosService } from '../cursos.service';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cursos-form',
  templateUrl: './cursos-form.component.html',
  styleUrls: ['./cursos-form.component.scss']
})
export class CursosFormComponent implements OnInit {

  form: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: CursosService,
    private modal: AlertModalService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);
    if (this.form.valid) {
      this.service.create(this.form.value).subscribe(
        success => {
          this.modal.showAlertSuccess('Curso inserido com sucesso!');
          this.location.back();
        },
        error => this.modal.showAlertDanger(error),
        () => console.log('request completo')
      );
      console.log('Submit');
    }
  }

  onCancel() {
    this.submitted = false;
    this.form.reset();
  }

  hasError(field: string) {
    return this.form.get(field).errors;
  }

}
