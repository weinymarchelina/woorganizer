import { Provider } from "next-auth/client";
import Layout from "../components/Layout";
import { RoleProvider } from "../Contexts/RoleContext";
import "../styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <RoleProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RoleProvider>
    </Provider>
  );
}

export default App;
