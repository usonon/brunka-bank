import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MyBank from "./pages/MyBank";
import Savings from "./pages/Savings";
import LoanRequest from "./pages/LoanRequest";
import Insurance from "./pages/Insurance";
import Credits from "./pages/Credits";
import Contact from "./pages/Contact";
import LoanSimulator from "./pages/LoanSimulator";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CardComparator from "./pages/CardComparator";
import MortgageSimulator from "./pages/MortgageSimulator";
import RetirementGuide from "./pages/RetirementGuide";
import RetirementSimulator from "./pages/RetirementSimulator";
import IFIGuide from "./pages/IFIGuide";
import WealthTaxSimulator from "./pages/WealthTaxSimulator";
import Help from "./pages/Help";
import Legal from "./pages/Legal";
import ScrollToTop from "./components/ScrollToTop";



function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/ma-banque"} component={MyBank} />
      <Route path={"/epargne"} component={Savings} />
      <Route path={"/demander-pret"} component={LoanRequest} />
      <Route path={"/assurance"} component={Insurance} />
      <Route path={"/credits"} component={Credits} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/loan-simulator"} component={LoanSimulator} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/login"} component={Login} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/card-comparator"} component={CardComparator} />
      <Route path={"/mortgage-simulator"} component={MortgageSimulator} />
      <Route path={"/retirement-guide"} component={RetirementGuide} />
      <Route path={"/retirement-simulator"} component={RetirementSimulator} />
      <Route path={"/ifi-guide"} component={IFIGuide} />
      <Route path={"/wealth-tax-simulator"} component={WealthTaxSimulator} />
      <Route path={"/aide"} component={Help} />
      <Route path={"/mentions-legales"}>{() => <Legal kind="mentions" />}</Route>
      <Route path={"/conditions"}>{() => <Legal kind="conditions" />}</Route>
      <Route path={"/confidentialite"}>{() => <Legal kind="confidentialite" />}</Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
