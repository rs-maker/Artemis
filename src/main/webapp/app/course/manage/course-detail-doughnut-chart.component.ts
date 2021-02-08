import { Component, Input, OnInit } from '@angular/core';
import { CourseStatisticsDataSet } from 'app/overview/course-statistics/course-statistics.component';

@Component({
    selector: 'jhi-course-detail-doughnut-chart',
    templateUrl: './course-detail-doughnut-chart.component.html',
    styleUrls: ['./course-detail-doughnut-chart.component.scss'],
})
export class CourseDetailDoughnutChartComponent implements OnInit {
    @Input() doughnutChartTitle: string;

    // Chart.js data
    doughnutChartType = 'doughnut';
    doughnutChartColors = ['rgba(219, 0, 0, 1)', 'rgba(122, 204, 69, 1)'];
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

    ngOnInit(): void {
        this.doughnutChartData[0].data = [10, 20];
    }
}
