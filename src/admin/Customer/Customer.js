import { useState } from "react";
import { Link } from "react-router-dom";

const Customers = () => {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([
    { id: 1, name: "John Doe", email: "johndoe@example.com", phone: "+1 234 567 890", orders: 5 },
    { id: 2, name: "Jane Smith", email: "janesmith@example.com", phone: "+1 987 654 321", orders: 3 },
    { id: 3, name: "Alice Johnson", email: "alicej@example.com", phone: "+1 555 444 333", orders: 7 },
  ]);

  // Filter customers based on search input
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  // Function to delete a customer
  const deleteCustomer = (id) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
  };

  return (
    <div className="flex flex-col p-6 w-full lg:ml-64">
      {/* Header */}
      <div className="bg-white shadow p-4 rounded-md flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Customers</h1>
        <input
          type="text"
          placeholder="Search Customers..."
          className="border rounded-md px-3 py-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white p-6 rounded-md shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b">
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.email}</td>
                <td className="p-3">{customer.phone}</td>
                <td className="p-3">{customer.orders}</td>
                <td className="p-3">
                  <Link
                    to={`/customers/${customer.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600 transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
