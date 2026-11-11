import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { DemoPersonaBar } from "./components/DemoPersonaBar";
import Checkout from "./pages/Checkout";
import AccountAccess from "./pages/AccountAccess";
import NotFoundPage from "./pages/NotFound";
import OrderSuccess from "./pages/OrderSuccess";
import Portal from "./pages/Portal";
import ProductDetails from "./pages/ProductDetails";
import Storefront from "./pages/Storefront";

function Router() {
  return <Switch>
    <Route path="/" component={Storefront} />
    <Route path="/account" component={AccountAccess} />
    <Route path="/product/:slug">{params => <ProductDetails slug={params.slug} />}</Route>
    <Route path="/checkout" component={Checkout} />
    <Route path="/order-success" component={OrderSuccess} />
    <Route path="/customer"><Portal role="customer" /></Route>
    <Route path="/seller"><Portal role="seller" /></Route>
    <Route path="/admin"><Portal role="admin" /></Route>
    <Route path="/404" component={NotFoundPage} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <DemoPersonaBar />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
