import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
// class Weather implements Coordinates {
//   date: string;
//   temp: number;
//   feelsLike: number;
//   humidity: number;
//   windSpeed: number;
//   windDirection: number;
//   description: string;
//   icon: string;

//   constructor() {
//     this.date = '';
//     this.temp = 0;
//     this.feelsLike = 0;
//     this.humidity = 0;
//     this.windSpeed = 0;
//     this.windDirection = 0;
//     this.description = '';
//     this.icon = '';
//   }
// }

// TODO: Complete the WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;
  cityName: string;
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  private fetchLocationData(query: string) {
    const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const { lat, lon } = data[0];
        return { lat, lon };
      });
  }

  // TODO: Create destructureLocationData method
    // private destructureLocationData(locationData: Coordinates): Coordinates {
    //  const { lat, lon } = locationData;
    // return { lat, lon };
    // }
  
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    try {
      const query = this.buildGeocodeQuery();
      const { lat, lon } = await this.fetchLocationData(query);
      return { lat, lon };
    } catch (error) {
      console.error('Error fetching location data', error);
      throw error;
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    let response = await fetch(this.buildWeatherQuery(coordinates))
    response = await response.json();
    return response;
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {
  //   const { main, weather, wind, dt } = response.list[0];
  //   const currentWeather = new weather();
  //   currentWeather.date = new Date(dt * 1000).toLocaleDateString();
  //   currentWeather.temp = main.temp;
  //   currentWeather.feelsLike = main.feels_like;
  //   currentWeather.humidity = main.humidity;
  //   currentWeather.windSpeed = wind.speed;
  //   currentWeather.windDirection = wind.deg;
  //   currentWeather.description = weather[0].description;
  //   currentWeather.icon = weather[0].icon;
  //   return currentWeather;
  // }

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
  //   const forecastArray = weatherData.list.map((item: any) => {
  //     const { main, weather, wind, dt } = item;
  //     const forecast = new Weather();
  //     forecast.date = new Date(dt * 1000).toLocaleDateString();
  //     forecast.temp = main.temp;
  //     forecast.feelsLike = main.feels_like;
  //     forecast.humidity = main.humidity;
  //     forecast.windSpeed = wind.speed;
  //     forecast.windDirection = wind.deg;
  //     forecast.description = weather[0].description;
  //     forecast.icon = weather[0].icon;
  //     return forecast;
  //   });
  //   forecastArray.shift();
  //   forecastArray.unshift(currentWeather);
  //   return forecastArray;
  // }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    let coordinates = await this.fetchAndDestructureLocationData()
    let weatherData = await this.fetchWeatherData(coordinates);
    return weatherData;
  }
}

export default new WeatherService();
