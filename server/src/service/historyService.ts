import fs from 'fs/promises';
import path from 'path';

// // TODO: Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const filePath = path.join(__dirname, '../data/searchHistory.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    const filePath = path.join(__dirname, '../data/searchHistory.json');
    await fs.writeFile(filePath, JSON.stringify(cities, null, 2));
    return cities;
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const data = await this.read();
    return data.map((city: City) => new City(city.name, city.id));
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.read();
    const id = Date.now().toString();
    const newCity = new City(city, id);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    try {
      let cities = await this.read(); // read the current cities
      cities = cities.filter((city: City) => city.id !== id); // filter out city with id
      await this.write(cities); // write updated cities back to file
      return true; // if successful
      } catch (error) {
        console.error('Error removing city:', error);
        throw new Error('Failed to remove city');
      }
    }
  }

export default new HistoryService();
