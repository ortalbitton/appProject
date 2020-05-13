import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Subscription } from "rxjs";

import { AdvertisementsService } from "../advertisements/advertisements.service";
import { Location } from '../advertisements/location.model';

@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.css']
})
export class D3Component implements OnInit, OnDestroy {
  @ViewChild('chart', { static: false }) Component

  margin = { top: 20, right: 20, bottom: 30, left: 40 };

  locations: Location[] = [];
  notesPerPage = 2;
  currentPage = 1;
  private notesSub: Subscription;

  constructor(private advertisementsService: AdvertisementsService) { }

  ngOnInit(): void {

    this.advertisementsService.getAdvertisements(this.notesPerPage, this.currentPage);
    this.notesSub = this.advertisementsService
      .getAdvertisementUpdateListener()
      .subscribe((noteData: { locations: Location[] }) => {
        this.locations = noteData.locations;

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
      .domain(this.locations.map(d => d.city));

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(this.locations, d => d.count)]);

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
      .data(this.locations)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('fill', 'blue')
      .attr('x', d => x(d.city))
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => contentHeight - y(d.count));
  }

  ngOnDestroy() {
    this.notesSub.unsubscribe();
  }

}

