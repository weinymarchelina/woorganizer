import { Provider } from "next-auth/client";
import Layout from "../components/Layout";
import { GlobalProvider } from "../context/Context";
import "../styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <GlobalProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalProvider>
    </Provider>
  );
}

export default App;
