import { useState } from "react";
import {
  BrowserRouter as Router,
} from "react-router-dom";
import {
  Arwes,
  SoundsProvider,
  ThemeProvider,
  createSounds,
  createTheme,
} from "arwes";

import AppLayout from "./pages/AppLayout";
import SplashScreen from "./components/SplashScreen";
import { theme, resources, sounds } from "./settings";

const arwesTheme = createTheme(theme);
const arwesSounds = createSounds(sounds);

const App = () => {
  const [splashActive, setSplashActive] = useState(true);

  return (
    <ThemeProvider theme={arwesTheme}>
      <SoundsProvider sounds={arwesSounds}>
        {splashActive && <SplashScreen onFinish={() => setSplashActive(false)} />}
        <Arwes animate background={resources.background.large} pattern={resources.pattern}>
          {anim => (
            <Router>
              <AppLayout show={anim.entered} />
            </Router>
          )}
        </Arwes>
      </SoundsProvider>
    </ThemeProvider>
  );
};

export default App;
