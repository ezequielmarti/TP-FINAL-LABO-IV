import { Component, OnInit } from '@angular/core';
import { Weather } from '../../inerfaces/weather';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit{

  clima?: Weather;

  constructor(private dataService: DataService){}
  ngOnInit(): void {
    this.reload();
  }

  reload(){
    this.dataService.loadApiWeather()
    .subscribe(response =>{
      this.clima = response as Weather;
    },
    error =>{
      console.log('error al cargar',error);
  })
  }

  // Función para convertir la temperatura de Fahrenheit a Celsius
  convertToCelsius(fahrenheit: number): number {
    return ((fahrenheit - 32) * 5) / 9;
  }

  // Función para convertir la velocidad del viento de millas por hora a kilómetros por hora
  convertToKmPerHour(mph: number): number {
    return mph * 1.60934;
  }
}
