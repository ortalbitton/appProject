import { Component, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { MapReduceService } from './mapReduce.service'
import { Title } from './title.model'


@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.css']
})
export class D3Component implements OnInit {
  @ViewChild('chart', { static: false }) Component

  margin = { top: 20, right: 20, bottom: 30, left: 40 };

  titles: Title[] = [];

  constructor(private mapReduceService: MapReduceService) { }

  ngOnInit(): void {

    this.mapReduceService.listofTitles().subscribe(data => {
      this.titles = data.titles;
      this.createChart();
    });
  }

  private createChart(): void {
    const element = document.getElementById("chart");

    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(this.titles.map(d => d._id));

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(this.titles, d => d.value)]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(2))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end');

    g.selectAll('.bar')
      .data(this.titles)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('fill', '#f7ece8')
      .attr('x', d => x(d._id))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => contentHeight - y(d.value));
  }

}

