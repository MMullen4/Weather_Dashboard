import { Router, type Request, type Response } from 'express';
const router = Router();


// import HistoryService from '../../service/historyService.js';
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
    return res.json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }

  // TODO: save city to search history
});

// TODO: GET search history
router.get('/history', async (_req: Request, _res: Response) => {

});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, _res: Response) => {

});

export default router;
