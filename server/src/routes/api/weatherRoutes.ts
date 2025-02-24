import { Router, type Request, type Response } from 'express';

import WeatherService from '../../service/weatherService.js';
import HistoryService  from '../../service/historyService.js';
const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // 
  try {
    const city = req.body.cityName;
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }
    console.log("WR post cityName: ", city)

    const weatherData = await WeatherService.getWeatherForCity(city);

    // TODO: GET weather data from city name

    // console.log("Data: ", weatherData)

    // TODO: save city to search history
    await HistoryService.addCity(city);
    return res.json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// TODO: GET search history

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const searchHistory = await HistoryService.getCities();
    res.json(searchHistory);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// * BONUS TODO: DELETE city from search history
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
