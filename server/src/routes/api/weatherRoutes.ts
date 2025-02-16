import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
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
  private searchHistory: SearchHistory[] = [];
  static async saveSearch(search: SearchHistory): Promise<void> {
    this.searchHistory.push(search);
  }
  static async getSearchHistory(): Promise<SearchHistory[]> {
    return this.searchHistory;
  }
}
router.get('/history', async (_req: Request, _res: Response) => {
  const searchHistory = await HistoryService.getSearchHistory();
  return _res.json(searchHistory);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, _res: Response) => {
  const { id } = _req.params;
  // await HistoryService.removeCity(id);
  // return _res.status(204).send();

});

export default router;
