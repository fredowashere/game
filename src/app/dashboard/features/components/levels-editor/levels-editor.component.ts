import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AreYouSureComponent } from '../../are-you-sure.component';
import { LevelService } from '../../services/level.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ILevel } from '../../models/levels';
import { Subject, startWith, takeUntil } from 'rxjs';

@Component({
  selector: 'app-levels-editor',
  templateUrl: './levels-editor.component.html',
  styleUrls: ['./levels-editor.component.css']
})
export class LevelsEditorComponent implements OnInit, OnDestroy {

  @ViewChild("dt") dt!: TableComponent;

  destroy$ = new Subject<void>();
  levels: ILevel[] = [];

  constructor(
    private levelService: LevelService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.levelService.levelsUpdated
      .pipe(
        startWith(""),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.levels = this.levelService.getSortedArray(
          this.levelService.getAll()
        );
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  async reset() {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    this.levelService.resetToFactory();
  }

  async create() {
    this.router.navigate([ -1 ], { relativeTo: this.route });
  }

  async edit(level: ILevel) {
    this.router.navigate([ level.id ], { relativeTo: this.route });
  }

  async deleteOne(level: ILevel) {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    this.levelService.delete(level.id!);
  }
}