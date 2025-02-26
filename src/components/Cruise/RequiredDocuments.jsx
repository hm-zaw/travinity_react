import React from 'react'

function RequiredDocuments() {
  return (
    <div className="text-blue-950 p-3">
    <h3 className="text-xl font-bold mb-4">Required Documents</h3>
    <ul className="list-disc pl-5">
      <li>Passport</li>
      <li>Visa (if applicable)</li>
      <li>Travel Insurance</li>
      <li>COVID-19 Vaccination Certificate</li>
      <li>Boarding Pass</li>
    </ul>

    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">VISA/PASSPORT REQUIREMENTS AND PASSAGE RESTRICTIONS:</h4>
      <p className="mb-4">
        All Guests must have valid government-issued citizenship documentation in order to sail, which may include valid original passports and/or necessary visas. Those without proper citizenship documentation will be denied embarkation. Disney Cruise Line strongly encourages Guests of all ages to have a valid passport for all cruises.
      </p>
      <p className="mb-4">
        Guests are solely responsible for checking and meeting the entry and documentation requirements of each country and port of call on their itinerary, including, but not limited to, valid visas and passports. Make sure your passports aren’t expired or about to expire. Many countries require your passport to be valid up to 3 months after the completion of your cruise. Check the passport policies in the countries you plan to visit ahead of time.
      </p>
    </div>
  </div>
  )
}

export default RequiredDocuments