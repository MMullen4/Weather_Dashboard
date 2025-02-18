import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather implements Coordinates {
  constructor(
    public readonly date: string,
    public readonly temp: number,
    public readonly feelsLike: number,
    public readonly humidity: number,
    public readonly windSpeed: number,
    public readonly windDirection: number,
    public readonly description: string,
    public readonly icon: string,
    public readonly lat: number,
    public readonly lon: number
  ) { }

  static fromApiResponse(data: any): Weather {
    return new Weather(
      data.dt_txt || new Date().toISOString(),
      data.main?.temp || 0,
      data.main?.feels_like || 0,
      data.main?.humidity || 0,
      data.wind?.speed || 0,
      data.wind?.deg || 0,
      data.weather?.[0]?.description || '',
      data.weather?.[0]?.icon || '',
      data.coord?.lat || 0,
      data.coord?.lon || 0
    );
  }

  toJSON(): any {
    return {
      date: this.date,
      temp: this.temp,
      feelsLike: this.feelsLike,
      humidity: this.humidity,
      windSpeed: this.windSpeed,
      windDirection: this.windDirection,
      description: this.description,
      icon: this.icon,
      lat: this.lat,
      lon: this.lon,
    };
  }
}

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
    //const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;

    //console.log("Endpoint: ", url)
    return fetch(query)
      .then((response) => response.json())
      .then((data) => {
        const { lat, lon } = data[0];
        return { lat, lon };
      });
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    //console.log("Destructure: ", locationData)
    const { lat, lon } = locationData;
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    const url = `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
    //console.log("Forecast Url: ", url);
    return url
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    try {
      const query = this.buildGeocodeQuery();
      const { lat, lon } = await this.fetchLocationData(query);
     // console.log("Coords: ", lat, lon)
      return this.destructureLocationData({ lat, lon });
      // return { lat, lon };
    } catch (error) {
      console.error('Error fetching location data', error);
      throw error;
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    let response = await fetch(this.buildWeatherQuery(coordinates))
    //console.log("response: ", response);
    response = await response.json();
    return response;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { list } = response;
    const { main, weather, wind, dt } = list[0];
    return new Weather(
      new Date(dt * 1000).toLocaleDateString(),
      main.temp,
      main.feels_like,
      main.humidity,
      wind.speed,
      wind.deg,
      weather[0].description,
      weather[0].icon,
      response.city.coord.lat,
      response.city.coord.lon
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    console.log("Current: ", currentWeather);
    console.log("Weather Data: ", weatherData);
    const forecasts = weatherData[0].list;

    const forecastArray: Weather[] = forecasts.map((item: any) => {
      // validate required props exist
      if (!item?.dt || !item?.main || !item?.weather || !item?.wind) {
        throw new Error('Invalid weather data');
      }
      // destructure needed props
      console.log("Item: ", item);
      const { main, weather, wind, dt } = item;

      // create new Weather object for each forecast item
      const temp = new Weather(
        new Date(dt * 1000).toLocaleDateString(),
        main.temp,
        main.feels_like,
        main.humidity,
        wind.speed,
        wind.deg,
        weather[0].description,
        weather[0].icon,
        currentWeather.lat,
        currentWeather.lon
      );

      console.log("Obj: ", temp);
      return temp;
    });
    // remove 1st item & replace with current 
    console.log("forecast array: ", forecastArray);
    forecastArray.shift();
    forecastArray.unshift(currentWeather);
    console.log("forecast array after: ", forecastArray);
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> { // method that takes a city name as input & returns promise to an array weather objects
    try {
      this.cityName = city; // stores city name in the class instance
      const coordinates = await this.fetchAndDestructureLocationData(); // get geo coords for the city
      const weatherData = await this.fetchWeatherData(coordinates); // uses the coords to fetch data
      //console.log("Forecast Data: ", weatherData)
      const currentWeather = this.parseCurrentWeather(weatherData); // processes raw weather data
      //console.log("Current Data: ", currentWeather)
      
      const weatherArray = Array.isArray(weatherData) ? weatherData : [weatherData]; // confirms data is in an array, if not wrap it in one
      //console.log("Weather Array: ", weatherArray)
      return this.buildForecastArray(currentWeather, weatherArray); // combines current and forecast data
    } catch (error) {
      console.error('Error fetching weather data', error);
      throw error;
    }
  }
}

export default new WeatherService();
