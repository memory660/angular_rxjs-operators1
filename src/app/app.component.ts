import { Component, OnInit } from '@angular/core';
import { combineLatest, interval, Observable, of } from 'rxjs';
import {
  mergeMap,
  groupBy,
  reduce,
  map,
  take,
  withLatestFrom,
} from 'rxjs/operators';

export interface ICourse {
  course_id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-rxjs-operators1';

  async ngOnInit() {
    //  ------------------------------------------------------------------------------------------------------------------
    //              regroupe par id       groupBy + mergeMap
    //  ------------------------------------------------------------------------------------------------------------------
    console.log(' ');
    console.log('-- (1) ----------------------');
    const source1$: Observable<ICourse> = of(
      { course_id: 1, name: 'Java' },
      { course_id: 2, name: 'TypeScript' },
      { course_id: 1, name: 'Python' },
      { course_id: 2, name: 'Angular' },
      { course_id: 3, name: 'PHP' }
    );

    source1$
      .pipe(
        groupBy((p: ICourse) => p.course_id),
        mergeMap((group$) =>
          group$.pipe(
            reduce((acc: ICourse[], cur: ICourse) => [...acc, cur], [])
          )
        )
      )
      .subscribe((p) => console.log('(1)', p));

    //  ------------------------------------------------------------------------------------------------------------------
    //              regroupe par id       mergeMap + promise
    //  ------------------------------------------------------------------------------------------------------------------
    console.log(' ');
    console.log('----- (3) ------------');

    const myPromise = (val: string) =>
      new Promise((resolve) => resolve(`hello ${val}`));
    const source$ = of('john');
    source$
      .pipe(mergeMap((p) => myPromise(p)))
      .subscribe((p) => console.log('(3)', p));

    source$
      .pipe(
        mergeMap(
          (p) => myPromise(p),
          (valuePromise, valueSource) => `${valuePromise} : ${valueSource}`
        )
      )
      .subscribe((p) => console.log('(3 bis)', p));
    //
    //
    //

    //  ------------------------------------------------------------------------------------------------------------------
    //              regroupe par id       mergeMap
    //  ------------------------------------------------------------------------------------------------------------------
    console.log(' ');
    console.log('---- (2) ---------------------');

    const letters$ = of('a', 'b');
    const interval$ = interval(500);
    letters$
      .pipe(mergeMap((letter) => interval$.pipe(map((i) => i + letter))))
      .pipe(take(4))
      .subscribe((p) => console.log('(2)', p));

    //  ------------------------------------------------------------------------------------------------------------------
    //              regroupe des sources    withLatestFrom
    //  ------------------------------------------------------------------------------------------------------------------
    console.log(' ');
    console.log('---- (4) ---------------------');
    const sourceL1$ = of('a', 'b');
    const sourceN1$ = of(0, 1, 2);

    sourceL1$ // 'a', 'b'
      .pipe(
        withLatestFrom(sourceN1$), // latest -> prend la dernière valeur : 2
        map(([r1, r2]) => {
          return `r1 = ${r1} r2 = ${r2}`;
        })
      )
      .subscribe((res) => console.log('(4)', res));
  }
}
