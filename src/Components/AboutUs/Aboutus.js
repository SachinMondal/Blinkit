const AboutUs = () => {
  const teamMembers = [
    { name: "John Doe", role: "CEO & Founder", img: "https://via.placeholder.com/150", linkedin: "#" },
    { name: "Jane Smith", role: "CTO", img: "https://via.placeholder.com/150", linkedin: "#" },
    { name: "Michael Brown", role: "Lead Developer", img: "https://via.placeholder.com/150", linkedin: "#" },
  ];

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
        <p className="mt-2 text-gray-600">We are dedicated to providing the best services.</p>
      </div>

      {/* Mission Section */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Our Mission</h2>
        <p className="mt-4 text-gray-600">
          Our mission is to innovate and create solutions that impact lives positively.
        </p>
      </div>

      {/* Team Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center mt-6 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 text-center w-64">
              <img src={member.img} alt={member.name} className="w-24 h-24 mx-auto rounded-full" />
              <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
              <a href={member.linkedin} className="mt-2 inline-block text-blue-500 hover:text-blue-700">
              <i class="fa-brands fa-linkedin text-2xl"></i>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Contact Us</h2>
        <div className="flex flex-wrap justify-center mt-4 gap-6">
          <div className="flex items-center space-x-3">
          <i class="fa-solid fa-envelope"></i>
            <p>contact@company.com</p>
          </div>
          <div className="flex items-center space-x-3">
          <i class="fa-solid fa-phone"></i>
            <p>+1 234 567 890</p>
          </div>
          <div className="flex items-center space-x-3">
          <i class="fa-solid fa-map"></i>
            <p>123 Business St, City, Country</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
