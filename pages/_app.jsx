import {UserProvider} from "@auth0/nextjs-auth0/client";
import "../styles/globals.css";

const App = ({Component, pageProps}) => (
  <UserProvider>
    <Component {...pageProps} />
  </UserProvider>
);

export default App;
