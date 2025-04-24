import { getAllHabitablePlanets } from "../../models/planets.model.js";

async function httpGetAllPlanets(req, res) {
  const habitablePlanets = await getAllHabitablePlanets();
  return res.status(200).json(habitablePlanets);
}

export {
  httpGetAllPlanets
}

