import { Router, type Request, type Response } from 'express';
const router = Router();
var APIKey = "e7a8f9b9b2e4b4b9b2e4b4b9b2e4b4b9";

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
    
  }

  // TODO: GET weather data from city name
  router.get ('/') {
    var queryURL = "https://api.openweathermap.org/3.0/weather?q=" + city + "appid=" + APIKey + "&units=imperial";
   
  
  }


  // TODO: save city to search history

});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {

});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {

});

export default router;
