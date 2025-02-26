import React, { useEffect, useState } from "react";

function RestrictionsPolicies() {
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("currentPage");
    return savedPage ? JSON.parse(savedPage) : 1;
  });

  const totalPages = 6;

  useEffect(() => {
    localStorage.setItem("currentPage", JSON.stringify(currentPage));
  }, [currentPage]);

  const goToNextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <div className="relative text-blue-950 lg:max-h-[650px] p-3">
      <div className="flex items-center absolute right-2 top-0 mb-4">
        <button onClick={goToPreviousPage} className="text-xl mr-3">
          &lt;
        </button>
        <span>
          {currentPage}/{totalPages}
        </span>
        <button onClick={goToNextPage} className="text-xl ml-3">
          &gt;
        </button>
      </div>

      {/* Add logic to render the content based on the currentPage */}
      <div>
        {currentPage === 1 && (
          <div>
            <h3 className="text-2xl font-bold mb-8">Booking Restrictions</h3>
            <ul className="list-disc pl-5">
              <li>
                <h4 className="font-semibold mb-2">PREGNANCY POLICY:</h4>
              </li>
              <p>
                Guests who are pregnant will be permitted to sail, depending
                upon the timeline of their pregnancy. Specifically, due to
                safety concerns, pregnant Guests will be refused passage if they
                have entered their 24th week of pregnancy by the embarkation
                date—or if they will enter their 24th week of pregnancy during
                the cruise.
              </p>

              <br />

              <li>
                <h4 className="font-semibold mb-2">INFANT & MINOR POLICY:</h4>
              </li>
              <p>
                When a minor (age 17 and under) travels without a parent or
                legal guardian, an accompanying adult must present an
                Authorization For Minor To Travel Without a Parent or Legal
                Guardian Form, completed and signed by that child's parent or
                legal guardian. The minimum age requirement for infants to sail
                varies depending on the type of cruise and when the reservation
                was booked. For most itineraries, the minimum age to sail is 6
                months at time of embarkation. For the South Pacific,
                Transatlantic, Hawaii and Panama Canal repositioning cruises,
                the minimum age to sail is one year old at the time of
                embarkation.
              </p>

              <br />

              <li>
                <h4 className="font-semibold mb-2">SINGLE TRAVELER:</h4>
              </li>
              <p>
                Single-occupancy fares are 200% of the double-occupancy package
                price.
              </p>

              <br />

              <li>
                <h4 className="font-semibold mb-2">ADDING OF CABIN:</h4>
              </li>
              <p>
                Stateroom occupancy on board the ships is limited to the number
                of berths in that stateroom. Disney Cruise Line reserves the
                right to limit the number of berths and single staterooms sold.
              </p>
            </ul>
          </div>
        )}
        {currentPage === 2 && (
          <div>
            <h3 className="text-2xl font-bold mb-8">
              Booking Process and Regulations
            </h3>
            <ul className="list-disc pl-5">
              <li>
                <p>
                  Guests who are pregnant will be permitted to sail, depending
                  upon the timeline of their pregnancy. Specifically, due to
                  safety concerns, pregnant Guests will be refused passage if
                  they have entered their 24th week of pregnancy by the
                  embarkation date—or if they will enter their 24th week of
                  pregnancy during the cruise.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Depending on the passenger's health condition, transportation
                  service providers may require proof of medical fitness to
                  travel and reserve the right to deny passenger access to their
                  transportation service.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Different transportation service providers have varied
                  requirements on accepted maximum gestational age of pregnant
                  women and minimum age of infants. Please consult our staff for
                  more details.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Infants, children, teenagers, and pregnant woman shall meet
                  the booking requirements in the terms of the "Booking
                  Restrictions" prior to boarding.
                </p>
                <br />
              </li>

              <li>
                <p>
                  The cruise operator stipulates that each passenger, including
                  children and infants, must occupy a bed. Please base your
                  booking on the actual number of persons who are travelling and
                  ensure that beds are booked for all guests.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Rooms below suite level have limited space. Please note that
                  it will be relatively crowded with four adults staying in one
                  room.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Prices are subject to changes due to foreign exchange rate
                  fluctuations. Travinity.com reserves the right to adjust the
                  prices prior to passenger departure. Any price changes will be
                  announced in a separate notice. All payments must be made in
                  full prior to departure.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Group tours booked on the Travinity.com website/app must be
                  paid in full with a Visa, MasterCard, UnionPay credit card,
                  Apply Pay, or PayPal. If the credit card used for payment was
                  issued outside the United States, the customer shall be
                  responsible for the difference in exchange rate between banks.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Payment by credit card or UnionPay card will be acknowledged
                  only after the bank confirms the transaction.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Payment shall be made within the agreed-upon period (as
                  determined based on the terms and conditions of different
                  itineraries). Some itineraries may be subject to changes,
                  depending on the operating conditions of different suppliers.
                  If any payment is overdue, Travinity.com has the right to
                  cancel the booking and any paid amount will not be refunded.
                  The booking is not transferable to other passengers, other
                  travel dates, or other group tours.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Passengers shall pay for their international flight tickets,
                  all domestic flight tickets and applicable transportation
                  fares in specific itineraries.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Please keep the receipt as proof should a refund be necessary.
                  If payment is made through a credit card or UnionPay card or
                  in interest-free instalments, the refund will have to be
                  processed by the bank and routed to the paying credit card or
                  bank account. This process will take at least three weeks. The
                  refund time and any terms and conditions are determined by the
                  credit card issuer.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Travinity.com reserves all final rights of interpretation.
                </p>
                <br />
              </li>

              <li>
                <p>
                  The passenger must provide his/her name as shown in the travel
                  document and explicitly confirm the name and travel document
                  information of any participant listed on the receipt.
                  Travinity.com shall not be held accountable for any additional
                  costs or obligations incurred due to incorrect names.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Depending on the passenger's health condition, transportation
                  service providers may require proof of medical fitness to
                  travel and reserve the right to deny passenger access to their
                  transportation service.
                </p>
                <br />
              </li>
              <br />
            </ul>
          </div>
        )}
        {currentPage === 3 && (
          <div>
            <h3 className="text-2xl font-bold mb-8">Changes & Refunds</h3>
            <ul className="list-disc pl-5">
              <li>
                <p>
                  Refund Alert: Due to the impact of COVID-19 worldwide, refunds
                  will be processed in accordance with the latest cruise lines
                  policies. Please note that at the cruise line's discretion,
                  refunds may be made in the form of Future Cruise Credits. The
                  final decision regarding the refund method will be made by the
                  cruise line.
                </p>
                <br />
              </li>

              <li>
                <p>
                  The cruise captain has the right to alter the scope of
                  navigation, rearrange the order of port stops, or omit one or
                  more port stops under the following circumstances:
                  <p>
                    1) Force majeure or other circumstances beyond the control
                    of the captain or the ship operator.
                  </p>
                  <p>2) For the sake of passenger safety and ship security.</p>
                  <p>
                    3) To provide anyone onboard with access to onshore medical
                    or surgical treatment.
                  </p>
                  <p>
                    4) Any other potential emergency, including fuel problems
                    that may arise in unforeseen or emergency circumstances.
                  </p>
                  The captain's decision shall be the final decision.
                  Travinity.com shall not be held liable for any changes and
                  shall not indemnify passengers for such changes.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Unless otherwise stated, "force majeure" refers to an event or
                  circumstance that Travinity.com has no control over or is
                  unable to avoid or overcome after it occurs. Force majeure
                  includes but is not limited to war, hostilities (whether war
                  be declared or not), invasion, act of foreign enemies, unrest,
                  terrorism, violence, military coups, insurrection, civil war,
                  civil disorder, riots, strikes, plagues, and natural disasters
                  such as torrential rain, earthquakes, hurricanes, typhoons, or
                  volcanic activity. In the event of force majeure or
                  compromised security resulting in service suspension, route
                  suspension, or other incidents that result in itinerary
                  changes or partial/full cancellations, Travinity.com will
                  return to the passenger the payment made by the passenger
                  minus the losses incurred by the above incident.
                </p>
                <br />
              </li>

              <li>
                <p>
                  In the event that any passenger becomes unfit to begin or
                  continue the cruise, or is deemed to pose a threat to the
                  health, safety, or wellbeing of onboard passengers, or to
                  order and safety on the cruise, the captain, at any time and
                  at his/her discretion, has the right to:
                  <p>1) Deny the passenger access to the cruise ship.</p>
                  <p>2) Have the passenger disembark at any port.</p>
                  <p>
                    3) Prohibit the passenger from disembarking at any
                    particular port.
                  </p>
                  <p>
                    4) Confine the passenger to particular areas of the ship or
                    deny the passenger access to particular onboard activities.
                  </p>
                  The captain's decision shall be the final decision and no paid
                  amount shall be refunded.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Requests to cancel the booking or to change the room type,
                  place of departure, date of departure, name or travel document
                  information for personal reasons will all be deemed as a
                  booking cancellation request.
                </p>
                <br />
              </li>

              <li>
                <p>
                  If the passenger does not participate in or leaves midway any
                  group activity (e.g., meals or sightseeing), it will be deemed
                  as an automatic waiver and the paid amount will not be
                  refunded.
                </p>
                <br />
              </li>

              <li>
                <h4 className="font-semibold mb-2">Amendment</h4>
                <p>
                  Restrictions: The primary Guest must remain on the
                  reservation, or the booking will be cancelled, subject to the
                  applicable cancellation fees. The Primary Guest refers to the
                  first traveler entered or selected when placing your order.
                </p>
                <p>
                  Subject to clause, an amendment fee of USD50 (or its
                  equivalent) (depending on your selected currency during
                  booking) will be charged for other guest(s) requested by a
                  Guest to a booking after the cruise ticket is issued. And the
                  latest time for name change is 3 working days before the
                  sailing date.
                </p>
                <br />
              </li>
            </ul>
          </div>
        )}
        {currentPage === 4 && (
          <div>
            <h3 className="text-2xl font-bold mb-8">Liability Policy</h3>
            <ul className="list-disc pl-5">
              <li>
                <p>
                  If the passenger applies for a visa or other travel document
                  by himself/herself and the travel is affected due to the
                  travel document, the passenger shall assume the corresponding
                  losses.
                </p>
                <br />
              </li>

              <li>
                <p>
                  If the passenger waives the itinerary before it is completed,
                  the passenger shall be responsible for himself/herself after
                  such waiver. Any consequences thereupon have no relation to
                  Travinity.com or its commissioned partners.
                </p>
                <br />
              </li>

              <li>
                <p>
                  If the passenger transfers his/her ticket to another person on
                  his/her own, employees from Travinity.com and its commissioned
                  partners have the right to invalidate the use of this ticket
                  and no payment will be refunded, unless such transfer is
                  explicitly approved and arranged by Travinity.com. Such person
                  shall be responsible for his/her insurance, liability
                  compensation, and consequences of actions during the travel
                  period.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Even if the passenger holds a valid entry visa and travel
                  documents but is denied access by the customs office on duty,
                  Travinity.com and its commissioned partners shall not be held
                  accountable in any way. All additional accommodation, food and
                  transportation shall be paid for by the passenger and no
                  compensation will be provided for the remaining itinerary.
                  Refunds and date changes are not permitted in such cases.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Accommodations, meals, and sightseeing tours will be arranged
                  according to the itinerary. In the event of special
                  circumstances such as denial of visa, no hotel occupancy,
                  change of flight date or location, or any other circumstances
                  beyond the control of Travinity.com or its commissioned
                  partners that result in the addition or deletion of tour
                  activities, ad hoc changes to transportation, flight time,
                  aircraft model, or hotel, Travinity.com and its commissioned
                  partners shall not be held liable for such changes in any way.
                  Travinity.com and its commissioned partners will try their
                  utmost to handle the situation and the passenger should not
                  object without valid reason; no refunds shall be given for any
                  cancelled programs or activities.Travinity.com and its
                  commissioned partners shall not be responsible for any
                  additional costs incurred as a result of delays. If the
                  passenger waives the remaining itinerary in the middle of the
                  trip, the passenger shall be responsible for its waiver of the
                  trip. Any consequences thereupon have nothing to do with
                  Travinity.com or its commissioned partner.
                </p>
                <br />
              </li>

              <li>
                <p>
                  In the event of force majeure or compromised security
                  resulting in service suspension, route suspension or change,
                  or other incidents that result in itinerary changes or
                  partial/full cancellations, Travinity.com will return to the
                  passenger the payment made by the passenger minus the losses
                  incurred by the aforementioned incident.
                </p>
                <br />
              </li>

              <li>
                <p>
                  With the exception of services directly provided by
                  Travinity.com, in the event of any transportation delay, lost
                  luggage, accidental injury or death, and loss during services
                  like transportation (e.g., flight, bus, ship, train or tour
                  bus), accommodation, meals or entertainment and sightseeing
                  programmes provided by other independent agencies and arranged
                  by Travinity.com and its employees or subsidiaries or
                  companies with business relations with Travinity.com, the
                  passenger shall directly negotiate with and claim damages from
                  the organization that owns, manages, or operates the service
                  in accordance with local laws. Such organizations normally
                  have different established regulations on responsibility
                  towards guests. In such cases, Travinity.com shall not be held
                  accountable for such loss, injury, death, or damages.
                </p>
                <br />
              </li>

              <li>
                <p>
                  With the exception of passenger injury or death caused by
                  negligence of Travinity.com employees or agencies under their
                  direct control or management, Travinity.com shall not be
                  responsible for any injury, death, economic loss, effect on
                  recreational activities, or emotional distress.
                </p>
                <br />
              </li>

              <li>
                <p>
                  The execution, effect, interpretation, performance and dispute
                  resolution of this Agreement are governed by the laws of the
                  United States and shall be interpreted according to the laws
                  of the United States. Both parties shall also be subject to
                  the non-exclusive jurisdiction of the courts of the United
                  States.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Travel agencies are not owned or operated by Disney Cruise
                  Line and act solely as the Guest's agent in arranging
                  vacations.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Travel agencies are not authorized to create any obligation or
                  responsibility on Disney Cruise Line's behalf or in Disney
                  Cruise Line's name or authorized to bind Disney Cruise Line in
                  any manner or make any representation, warranty, covenant,
                  agreement or commitment on Disney Cruise Line’s behalf, or
                  accept payment for Disney Cruise Line or take any other action
                  on Disney Cruise Line‘s behalf. The relationship between
                  Disney Cruise Line and travel agencies is that of independent
                  contractor. For the avoidance of doubt, Disney Cruise Line
                  does not give travel agencies express or implied consent to
                  carry out a mandate, nor express or implied authority to act
                  on behalf of Disney Cruise Line, and travel agencies are not
                  agents of Disney Cruise Line.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Disney Cruise Line shall not be held responsible or bound by
                  any statement or representation made by such travel agencies,
                  and hereby expressly disclaims any liability, whether in
                  contract, tort or any other cause of action, for any personal
                  injury, illness, emotional distress, mental suffering,
                  psychological injury, damage, loss, delay, irregularity or
                  inconvenience that may be caused to any person or property,
                  whether directly or indirectly, as a result of an act or
                  omission of the travel agencies.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Guest shall remain liable at all times to Disney Cruise Line
                  for the price of the vacation. Guest understands and agrees
                  that receipt of the Cruise Contract or any other information
                  or notices by Guest’s travel agent or sales agent shall be
                  deemed receipt by the Guest as of the date of receipt by the
                  agent. Guest acknowledges that Disney Cruise Line is not
                  responsible for the financial condition or integrity of any
                  travel agent or sales agent.
                </p>
                <br />
              </li>
            </ul>
          </div>
        )}
        {currentPage === 5 && (
          <div>
            <h3 className="text-2xl font-bold mb-8">Travel Guidelines</h3>
            <ul className="list-disc pl-5">
              <li>
                <p>
                  Passengers must abide by the laws of each country. It is
                  strictly forbidden to carry illegal items when entering or
                  departing from a country, and any items and cash shall be
                  declared.
                </p>
                <br />
              </li>

              <li>
                <p>
                  All items purchased during a cruise will be subject to
                  applicable quarantine clearance procedures be local
                  authorities on disembarkation.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Some countries require visitors to have fingerprints and
                  photos taken upon arrival at airports, and port terminals.
                  Immigration officers may inquire about information including
                  the purpose of visit, travel itinerary, length of stay, and
                  travel companions.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Passengers shall comply with requirements of the instructions
                  provided for cruise ship travel products and safety warnings
                  provided for tourism activities, actively participate in and
                  complete marine emergency drills, and cooperate with safety
                  precautions and emergency measures implemented by relevant
                  departments, organizations, the cruise ship company or travel
                  agencies. For activities organized by passengers themselves,
                  the guidelines and arrangements of the service personnel shall
                  be followed. In addition, passengers shall take into account
                  their age, physical fitness level, health status, prevailing
                  weather conditions and the activity itself to determine
                  whether they should participate. Passengers shall assume any
                  liability arising from the activities. If a passenger
                  considers it necessary, he or she should seek advice from a
                  doctor or professional.
                </p>
                <br />
              </li>

              <li>
                <p>
                  According to customs regulations, there is a duty-free
                  allowance if the total value of items obtained overseas for
                  personal use and carried by inbound passengers is within a
                  certain amount; however, some types of goods are not included
                  within the duty-free scope. For further information, please
                  visit the website of the customs authority.
                </p>
                <br />
              </li>

              <li>
                <p>
                  Please note that due to restrictions under the U.S. Passenger
                  Vessels Services Act (Jones Act), cruise company cannot accept
                  reservations for consecutive itineraries that begin in one
                  U.S. port and conclude in a different U.S. port. In the event
                  such an itinerary is booked, cruise company reserves the right
                  to cancel one of the cruises at the Guest's expense and/or the
                  Guest shall be responsible for any and all Jones Act fines
                  that result due to such booking. Local cabotage laws are
                  subject to change at any time without warning. Deviations are
                  not permitted. Definitions: 'Deviation' - request from guest
                  to embark or disembark at a port of call other than the
                  scheduled embarkation/disembarkation port.
                </p>
                <br />
              </li>

              <li>
                <h4 className="font-semibold mb-2">LEGAL GUIDELINES:</h4>
                <p>
                  Passengers must abide by the laws of each country. It is
                  strictly forbidden to carry illegal items when entering or
                  departing from a country, and any items and cash shall be
                  declared.
                </p>
                <br />
              </li>

              <li>
                <h4 className="font-semibold mb-2">HEALTH AND SAFETY:</h4>
                <p>
                  Disney Cruise Line may refuse passage or transport or may
                  debark at any port any Guest who may be suffering from a
                  contagious or infectious disease (including but not limited to
                  COVID-19), ill health or whose presence in the opinion of the
                  Master may be detrimental to the comfort or safety of other
                  Guests or the crew, or who, in the Master's opinion, might be
                  excluded from landing at destination by immigration or other
                  governmental authorities. In such cases, the Guest shall not
                  be entitled to any refund of fare or compensation whatsoever.
                  Disney Cruise Line reserves the right to refuse passage to
                  Guests with criminal backgrounds.
                </p>
                <br />
              </li>

              <li>
                <h4 className="font-semibold mb-2">INSURANCE:</h4>
                <p>
                  While not required, we strongly recommend that all our Guests
                  purchase travel protection.
                </p>
                <br />
              </li>

              <li>
                <h4 className="font-semibold mb-2">
                  EXCEPTIONAL CIRCUMSTANCE:
                </h4>
                <p>
                  Itineraries, ports of call and offerings may change at any
                  time without notice due to unexpected or unplanned
                  circumstances or operational needs. Certain onboard venues,
                  experiences and other offerings may be modified or
                  unavailable, may have limited capacity and may be subject to
                  limited availability, advance reservations or closure.
                </p>
                <p>
                  Retail establishments and other facilities in ports of call
                  may be closed, restricted or have limited availability
                  especially during certain holiday periods.
                </p>
                <br />
              </li>
            </ul>
          </div>
        )}
        {currentPage === 6 && (
          <div>
            <h3 className="text-2xl font-bold mb-8">Other Policy Details</h3>
            <ul className="list-disc pl-5">
              <li>
                <p>
                  Travinity.com shall send receipts to passengers by email.
                  Passengers are advised to retain their receipts for emergency
                  or insurance claims.
                </p>
                <br />
              </li>

              <li>
                <p>
                  The person(s) making a booking and using the service promise
                  to fully indemnify Travinity.com for all legal actions,
                  proceedings, claims, payment demands, fees, judgements, and
                  damages that are directly or indirectly caused by a breach or
                  non-performance of any commitment, guarantee, or liability
                  under this clause arising from their use of the services of an
                  airline or cruise ship company.
                </p>
                <br />
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestrictionsPolicies;
