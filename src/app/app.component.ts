import { Component, OnInit } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { list, draw } from 'radash';
import { draw as drawPattern } from 'patternomaly';
import {
  ReplaySubject,
  Observable,
  from,
  reduce,
  mergeMap,
  zip,
  of,
  map,
} from 'rxjs';
import { loremIpsum } from 'lorem-ipsum';
import { generate as randomstring } from 'randomstring';
import { chartData, chartOptions } from './chart';

type Pattern = Parameters<typeof drawPattern>[0];

const backgrounds = {
  COMPLIANT: ['green', 'plus'],
  NON_COMPLIANT: ['red', 'cross'],
  INSUFFICIENT_DATA: ['#cccc00', 'dot'],
  NOT_APPLICABLE: ['grey', 'zigzag'],
};
type ComplianceType = keyof typeof backgrounds;

export const AllComplianceTypes: ComplianceType[] = [
  'COMPLIANT',
  'NON_COMPLIANT',
  'INSUFFICIENT_DATA',
  'NOT_APPLICABLE',
];

type DataRow = {
  ConfigRuleName: string;
  ConfigRuleId: string;
  Description: string;
  resourceCounts: Record<string, number>;
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ng2-charts-demo';

  public barChartLegend = true;
  public barChartPlugins = [];

  readonly columnsToDisplay = ['rule', 'region', 'resourceCounts'];

  public dataSource = new MyDataSource();

  constructor() {}
  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    const rules = list(1, Object.keys(chartData).length, (i) => ({
      ConfigRuleName: `ConfigRule-${i}`,
      ConfigRuleId: randomstring(10),
      region: `xx-${randomstring(4)}-1`,
      Description: loremIpsum(),
    }));

    from(rules)
      .pipe(
        mergeMap((rule, idx) => zip(of(rule), this.getResourceCounts$(idx))),
        map(([rule, resourceCounts]) => ({ ...rule, resourceCounts })),
        reduce((acc, row) => {
          acc.push(row);
          return acc;
        }, [] as DataRow[])
      )
      .subscribe((rules) => {
        console.debug('Tick!');
        this.dataSource.setRows(rules);
      });
  }

  private getResourceCounts$(
    index: number
  ): Observable<Record<string, number>> {
    // return this.getResources$(index).pipe(
    //   reduce((acc, resource) => {
    //     const { ComplianceType } = resource;
    //     acc[ComplianceType] ??= 0;
    //     acc[ComplianceType]++;
    //     return acc;
    //   }, {} as Record<string, number>)
    // );
    return of(chartData[index]);
  }

  private getResources$(index: number) {
    return from(
      list(1, 50, () => ({
        ComplianceType: draw(AllComplianceTypes) as ComplianceType,
      }))
    );
  }

  public getChartConfig(counts: Record<string, number>): ChartConfiguration {
    const complianceTypes = AllComplianceTypes.filter(
      (complianceType) => !!counts[complianceType]
    );
    return {
      options: chartOptions,
      data: {
        labels: [''],
        datasets: complianceTypes.map((complianceType) => {
          const color = backgrounds[complianceType][0];
          const pattern = backgrounds[complianceType][1] as Pattern;

          return {
            axis: 'y',
            label: this.labelFor(complianceType),
            data: [counts[complianceType]],
            backgroundColor: drawPattern(pattern, color),
          };
        }),
      },
      type: 'bar',
    };
  }

  private labelFor(complianceType: ComplianceType): string {
    let label = complianceType
      .split('_')
      .map((_) => _.toLowerCase())
      .join(' ');
    if (label === 'non compliant') {
      label = label.replace(' ', '-');
    }
    return label;
  }
}

class MyDataSource extends DataSource<DataRow> {
  private stream: ReplaySubject<DataRow[]>;
  private rows: DataRow[] = [];
  constructor() {
    super();
    this.stream = new ReplaySubject();
  }

  connect(): Observable<DataRow[]> {
    return this.stream;
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    // this.stream.unsubscribe();
  }

  addRow(row: DataRow) {
    console.debug('Add row', { row });
    this.rows.push(row);
    this.stream.next(this.rows);
  }

  setRows(rows: DataRow[]) {
    this.rows = rows;
    this.stream.next(this.rows);
  }
}
