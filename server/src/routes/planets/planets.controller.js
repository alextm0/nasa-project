import { getAllHabitablePlanets } from "../../models/planets.model.js";

function httpGetAllPlanets(req, res) {
  const habitablePlanets = getAllHabitablePlanets();
  return res.status(200).json(habitablePlanets);
}

export {
  httpGetAllPlanets
}

