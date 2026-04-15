// Importe BrowserRouter — active React Router dans l'app
import { BrowserRouter } from "react-router-dom"

// Importe Provider — rend Redux accessible partout
import { Provider } from "react-redux"

// Importe le store Redux qu'on a configuré avec Saga
import { store } from "./store"

// Importe ThemeProvider — rend le theme light/dark accessible partout
import { ThemeProvider } from "./themes/ThemeContext"

// Importe AppNavigator — déclare toutes les routes
import AppNavigator from "./navigation/AppNavigator"

// Styles globaux — reset, fonts, scrollbar...
import "./index.css"

export default function App() {
  return (
    // 1. Provider Redux — le plus externe
    //    → tout ce qui est dedans peut accéder au store
    <Provider store={store}>

      // 2. ThemeProvider — en dessous de Redux
      //    → peut lire Redux si besoin (ex: theme sauvegardé par user)
      <ThemeProvider>

        // 3. BrowserRouter — en dessous du theme
        //    → peut utiliser useTheme() dans les routes
        <BrowserRouter>
          <AppNavigator />
        </BrowserRouter>

      </ThemeProvider>
    </Provider>
  )
}
