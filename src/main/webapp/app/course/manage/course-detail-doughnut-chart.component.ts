import { Component } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { CourseStatisticsDataSet } from 'app/overview/course-statistics/course-statistics.component';

@Component({
    selector: 'jhi-course-detail-doughnut-chart',
    templateUrl: './course-detail-doughnut-chart.component.html',
})
export class CourseDetailDoughnutChartComponent {
    barChartOptions: ChartOptions = {};
    barChartType: ChartType = 'bar';
    doughnutChartType = 'doughnut';
    doughnutChartColors = ['red', 'green'];
    doughnutChartLabels: string[] = ['Done', 'Not Done'];
    totalScoreOptions: object = {
        cutoutPercentage: 75,
        scaleShowVerticalLines: false,
        responsive: false,
        tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1)',
        },
    };
    doughnutChartData: CourseStatisticsDataSet[] = [
        {
            data: [0, 0],
            backgroundColor: this.doughnutChartColors,
        },
    ];
}
