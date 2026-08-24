import { Helmet } from "react-helmet";
import Description from "./Description";

const Funding = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | Funding & Donations</title>
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <Description />
      </div>
    </div>
  );
};

export default Funding;
