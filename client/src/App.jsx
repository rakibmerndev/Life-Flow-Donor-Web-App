import { Helmet } from "react-helmet";
import Banner from "./Components/Banner/Banner";

// import Gallery from "../Components/Gallery/Gallery";

const App = () => {
  return (
    <>
      <Helmet>
        <title>LifeFlowDonor | Home</title>
      </Helmet>
      <Banner />
    </>
  );
};

export default App;
