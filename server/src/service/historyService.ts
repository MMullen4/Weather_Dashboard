import fs from 'fs/promises';
// import path from 'path';

// // TODO: Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  cities: City[] = [];
  filePath: string = 'searchHistory.json'; //path to store city seach history

  constructor(filePath: string = 'seachHistory.json') {
    this.filePath = filePath;
  }

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    console.log('reading from file:', this.filePath)
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      this.cities = JSON.parse(data);
      return this.cities;
    } catch (error) {
      console.error('Error reading file:', error);
      this.cities = [];
      return this.cities;
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    console.log('writing to file:', this.filePath)
    console.log('cities to write', cities);

    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
      this.cities = cities; //updates internal state
      return this.cities;
    } catch (error) {
      console.error('Error writing to file:', error);
      throw error;

    }
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const data = await this.read();
    return data.map((city: City) => new City(city.name, city.id));
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city?.trim) {
      throw new Error('Invalid city name');
    }
    const normalizedCity = city.toLocaleLowerCase().trim();
    if (this.cities.some((existingCity: City) => existingCity.name.toLocaleLowerCase() === normalizedCity)) {
      throw new Error('City already exists');
    }

    console.log('adding city', city);

    const newCity = new City(city, (this.cities.length + 1).toString());
    this.cities.push(newCity);
    await this.write(this.cities);
    return this.cities;
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: number) {
    try {
      const stringId = id.toString(); // convert id to string
      this.cities = this.cities.filter((city: City) => city.id !== stringId); // filter out city with id
      await this.write(this.cities); // write updated cities back to file
      return true; // if successful
    } catch (error) {
      console.error('Error removing city:', error);
      throw new Error('Failed to remove city');
    }
  }
}

export default new HistoryService();
