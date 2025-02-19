import { Router, type Request, type Response } from 'express';
const router = Router();
// import City from '../../service/historyService'; // connects City components 

import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;
  
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }
  // TODO: GET weather data from city name
  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    // console.log("Data: ", weatherData)
    // TODO: save city to search history
    await HistoryService.saveSearch({
      cityName,
      searchedAt: new Date()
    });
    
    return res.json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// TODO: GET search history
interface SearchHistory {
  cityName: string;
  searchedAt: Date;
}

class HistoryService {
  static searchHistory: SearchHistory[] = []; // static array that stores search history items
  static async saveSearch(search: SearchHistory): Promise<void> { //Method to add a new search to history

    this.searchHistory.push(search); // adds new search to the history array
  }
  static async getSearchHistory(): Promise<SearchHistory[]> { // retrieve search history
    return this.searchHistory;
  }
}
router.get('/history', async (_req: Request, _res: Response) => {
  const searchHistory = await HistoryService.getSearchHistory();
  return _res.json(searchHistory);
});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {
//   try {
//     const cityId = parseInt(req.params.id);

//     if (isNaN(cityId)) {
//       return res.status(400).json({ error: 'Invalid ID format' });
//     }

//     // Get current history
//     const history = await HistoryService.getSearchHistory();

//     // Find the index of the city to remove
//     const cityIndex = history.findIndex((item, index) => index === cityId);

//     if (cityIndex === -1) {
//       return res.status(404).json({ error: 'City not found in history' });
//     }

//     // Remove the city from history array
//     const updatedHistory = history.filter((_, index) => index !== cityId);

//     // Update the history
//     HistoryService.searchHistory = updatedHistory;

//     return res.json({
//       message: 'City removed from history successfully',
//       removedIndex: cityId
//     });
//   } catch (error) {
//     console.error('Error deleting city:', error);
//     return res.status(500).json({ error: 'Failed to delete city from history' });
//   }
// });

// router.delete('/history/:id', async (req, res) => {
//   // create a delete endpoint; :id is URL that captures the ID of the city
//   try {
//     const id = req.params.id;
//     if (!id) {
//       return res.status(400).json({ error: 'City ID is required' });
//     }

//     const deleteCity = await City.removeCity({
//       where: {
//         id: id
//       }
//     });

//     if (!deleteCity) {
//       return res.status(404).json({ error: 'City not found' });
//     }
//     res.json(deleteCity);
//   } catch (error) {
//     console.error('Error deleting city', error);
//     res.status(500).json(error); // reports errors to front end
//   }
// });

export default router;
