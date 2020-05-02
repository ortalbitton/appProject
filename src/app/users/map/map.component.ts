import { Component, OnInit, Input } from '@angular/core';
import { icon, latLng, Map, MapOptions, marker, tileLayer } from 'leaflet';
import { MapPoint } from './map-point.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: Map;
  mapPoint: MapPoint;
  options: MapOptions;
  lastLayer: any;

  @Input() latitude: number;
  @Input() longitude: number;

  constructor() {
  }

  ngOnInit() {
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();
  }

  initializeMap(map: Map) {
    this.map = map;
    this.createMarker();
  }

  private initializeMapOptions() {
    this.options = {
      zoom: 14,
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'OSM' })
      ]
    }
  }

  private initializeDefaultMapPoint() {
    this.mapPoint = {
      latitude: this.latitude,
      longitude: this.longitude
    };
  }

  private createMarker() {
    this.clearMap();
    const mapIcon = this.getDefaultIcon();
    const coordinates = latLng([this.mapPoint.latitude, this.mapPoint.longitude]);
    this.lastLayer = marker(coordinates).setIcon(mapIcon).addTo(this.map);
    this.map.setView(coordinates, this.map.getZoom());
  }

  private getDefaultIcon() {
    return icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: '../../assets/marker-icon.png'

    });
  }

  private clearMap() {
    if (this.map.hasLayer(this.lastLayer)) this.map.removeLayer(this.lastLayer);
  }

}

