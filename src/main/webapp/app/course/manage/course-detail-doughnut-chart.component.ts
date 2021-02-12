import { Component, Input, OnInit } from '@angular/core';
import { CourseStatisticsDataSet } from 'app/overview/course-statistics/course-statistics.component';

@Component({
    selector: 'jhi-course-detail-doughnut-chart',
    templateUrl: './course-detail-doughnut-chart.component.html',
    styleUrls: ['./course-detail-doughnut-chart.component.scss'],
})
export class CourseDetailDoughnutChartComponent implements OnInit {
    @Input() doughnutChartTitle: string;

    @Input() currentPercentage: number;
    @Input() currentAbsolute: number;
    @Input() currentMax: number;

    @Input() stats: number[];

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
        // mock
        this.currentPercentage = 50;
        this.currentAbsolute = 20;
        this.currentMax = 40;
        this.stats = [10, 20];
        this.doughnutChartData[0].data = this.stats;
    }
}
