import { Component, OnInit } from '@angular/core';
import { CursosService } from '../cursos.service';
import { Curso } from "../models/curso.model";
import { Observable, empty, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true
})
export class CursosListaComponent implements OnInit {

  // cursos: Curso[];
  cursos$: Observable<Curso[]>;
  error$ = new Subject<boolean>();
  bsModalRef: BsModalRef;

  constructor(
    private service: CursosService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    // this.service.list().subscribe(
    //   (dados) => (this.cursos = dados)
    // );

    this.onRefresh();
  }

  onRefresh() {
    this.cursos$ = this.service.list()
    .pipe(
      catchError(
        (err) => {
          console.error(err);
          //this.error$.next(true);
          this.handleError();
          return empty();
        }
      )
    );

    // this.service.list().subscribe(
    //   dados => {
    //     console.log(dados);
    //   },
    //   error => {
    //     console.error(error)
    //   },
    //   () => {
    //     console.log('Observable completo.')
    //   }
    // );
  }

  handleError() {
    this.bsModalRef = this.modalService.show(AlertModalComponent);
    this.bsModalRef.content.type = 'danger';
    this.bsModalRef.content.message = 'Erro ao carregar cursos. Tente novamente mais tarde.';
  }

}
