import { useState, useEffect } from "react";
import planetsData from "../data/planets.json";
import { httpGetPlanets } from "./requests";

function usePlanets() {
  const [planets, savePlanets] = useState(planetsData);

  useEffect(() => {
    let mounted = true;
    httpGetPlanets().then(fetchedPlanets => {
      if (mounted && fetchedPlanets) {
        savePlanets(fetchedPlanets);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return planets;
}

export default usePlanets;
