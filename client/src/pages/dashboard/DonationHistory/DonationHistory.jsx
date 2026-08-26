import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import useAuth from "../../../hooks/useAuth.js";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";

const DonationHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/${user?.email}`);
      return res.data;
    },
  });

  // Calculate total donated amount
  const totalAmount = donations.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | Donation History</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Donation History
          </h1>
          <p className="text-gray-600 mt-2">
            Track all your blood donation contributions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Donations Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Donations
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {donations.length}
                </p>
              </div>
              <div className="text-5xl text-red-600">💰</div>
            </div>
          </div>

          {/* Total Amount Donated Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Donated
                </p>
                <p className="text-4xl font-bold text-red-600 mt-2">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="text-5xl">❤️</div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-600 px-4 md:px-6 py-4">
            <h2 className="text-lg md:text-xl font-bold text-white">
              {donations.length} Transaction{donations.length !== 1 ? "s" : ""}
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Loading donation history...</p>
            </div>
          ) : donations.length > 0 ? (
            <>
              {/* Mobile/Tablet Card View */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4 p-4 md:p-6">
                {donations.map((item, index) => (
                  <div
                    key={item._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="space-y-3">
                      {/* Index and Amount */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-bold text-gray-900">#{index + 1}</span>
                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-bold text-sm">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Email */}
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Email</p>
                        <p className="text-sm text-gray-800 break-all">{item.email}</p>
                      </div>

                      {/* Date */}
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Date</p>
                        <p className="text-sm text-gray-800">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      {/* Transaction ID */}
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Transaction ID</p>
                        <p className="font-mono text-xs text-gray-800 break-all">{item.transactionId}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donations.map((item, index) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-bold">
                            ${item.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          <span className="font-mono text-xs">{item.transactionId}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-lg text-gray-600 mb-6">
                You haven&apos;t made any donations yet.
              </p>
              <p className="text-gray-500">
                Your donation history will appear here when you contribute.
              </p>
            </div>
          )}

          {/* Footer Stats */}
          {donations.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Total Transactions: <span className="font-semibold">{donations.length}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Total Amount: <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Average Donation:{" "}
                  <span className="font-semibold">
                    ${(totalAmount / donations.length).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Thank You Message */}
        {donations.length > 0 && (
          <div className="mt-8 bg-red-50 border-l-4 border-l-red-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Thank You for Your Generosity! 🙏
            </h3>
            <p className="text-red-800">
              Your donations are making a real difference in saving lives. Every contribution
              helps someone in need. We appreciate your compassion and support!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;
