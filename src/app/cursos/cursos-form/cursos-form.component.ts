import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CursosService } from '../cursos.service';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';

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
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.route.params.subscribe(
    //   (params) => {
    //     const id = params['id'];
    //     console.log(id);
    //     const curso$ = this.service.loadById(id);
    //     curso$.subscribe(
    //       (curso) => {
    //         this.updateForm(curso);
    //       }
    //     );
    //   }
    // );

    this.route.params
    .pipe(
      map((params: any) => params['id']),
      switchMap((id) => (this.service.loadById(id)))
    ).subscribe((curso) => this.updateForm(curso));

    // PARA CASOS DE CREATE, PUT E DELETE
    // concatMap -> a ordem da requisição importa
    // mergeMap -> a ordem da requisição não importa
    // exhaustMap -> casos de login    

    this.form = this.fb.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    });
  }

  updateForm(curso) {
    this.form.patchValue({
      id: curso.id,
      nome: curso.nome
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
