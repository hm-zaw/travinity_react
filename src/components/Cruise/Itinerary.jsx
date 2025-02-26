import React from 'react'

function Itinerary({ship}) {
  return (
    <table className="w-full text-left text-blue-950">
    <thead>
      <tr>
        <th className="py-2">Date</th>
        <th className="py-2">Route</th>
        <th className="py-2">Arrival</th>
        <th className="py-2">Departure</th>
      </tr>
    </thead>
    <tbody>
      {ship.Itinerary.map((item) => (
        <tr key={item.Day}>
          <td className="py-2">{item.Date}</td>
          <td className="py-2">{item.PortCity}, {item.PortCountry}</td>
          <td className="py-2">{item.Arrival? item.Arrival : "--"}</td> 
          <td className="py-2">{item.Departure? item.Departure : "--"}</td>                          
        </tr>
      ))}
    </tbody>
  </table>
  )
}

export default Itinerary