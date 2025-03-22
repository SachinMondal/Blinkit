import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CustomerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // Fetch customer details (Replace this with actual API call)
    const customersData = [
      { id: 1, name: "John Doe", email: "johndoe@example.com", phone: "+1 234 567 890", orders: 5, address: "123 Main St, NY", orderHistory: [{ id: 101, date: "2024-03-15", amount: "$50", status: "Delivered" }, { id: 102, date: "2024-03-18", amount: "$30", status: "Pending" }] },
      { id: 2, name: "Jane Smith", email: "janesmith@example.com", phone: "+1 987 654 321", orders: 3, address: "456 Elm St, CA", orderHistory: [{ id: 103, date: "2024-03-10", amount: "$75", status: "Delivered" }] },
    ];
    
    const foundCustomer = customersData.find((cust) => cust.id === parseInt(id));
    if (foundCustomer) {
      setCustomer(foundCustomer);
    } else {
      navigate("/customers");
    }
  }, [id, navigate]);

  if (!customer) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  return (
    <div className="p-6 w-full lg:ml-64">
      {/* Back Button */}
      <button onClick={() => navigate("/customers")} className="bg-gray-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-gray-600 transition">
        ← Back to Customers
      </button>

      {/* Customer Details Card */}
      <div className="bg-white p-6 rounded-md shadow">
        <h2 className="text-2xl font-semibold">{customer.name}</h2>
        <p className="text-gray-600">Email: {customer.email}</p>
        <p className="text-gray-600">Phone: {customer.phone}</p>
        <p className="text-gray-600">Address: {customer.address}</p>
        <p className="text-gray-600">Total Orders: {customer.orders}</p>

        {/* Action Buttons */}
        <div className="mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition">
            Edit
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
            Delete
          </button>
        </div>
      </div>

      {/* Order History Table */}
      <h3 className="text-xl font-semibold mt-6">Order History</h3>
      <div className="bg-white p-6 rounded-md shadow mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Order ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {customer.orderHistory.length > 0 ? (
              customer.orderHistory.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">{order.amount}</td>
                  <td className={`p-3 font-semibold ${order.status === "Delivered" ? "text-green-500" : "text-yellow-500"}`}>
                    {order.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerView;
