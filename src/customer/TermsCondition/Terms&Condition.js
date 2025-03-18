const TermsAndConditions = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-3">Terms and Conditions</h2>
        <p className="text-gray-700">
          Welcome to our application. By using this service, you agree to the following terms and conditions:
        </p>
        <ul className="list-disc list-inside mt-3 text-gray-600">
          <li>You must be at least 18 years old to use this service.</li>
          <li>All information provided must be accurate and up-to-date.</li>
          <li>We reserve the right to terminate accounts that violate our policies.</li>
          <li>Your data is stored securely, but we are not responsible for data breaches beyond our control.</li>
        </ul>
      </div>
    );
  };
  
  export default TermsAndConditions;
  