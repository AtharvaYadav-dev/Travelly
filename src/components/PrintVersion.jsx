import React from 'react';
import { Printer } from 'lucide-react';

const PrintVersion = ({ itinerary, formattedResponse }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="btn-expensive bg-white/5 px-8 text-sm flex items-center gap-2"
      >
        <Printer className="w-4 h-4" />
        Print
      </button>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything except print content */
          body * {
            visibility: hidden;
          }
          
          #print-content, #print-content * {
            visibility: visible;
          }
          
          #print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          /* Page setup */
          @page {
            size: A4;
            margin: 2cm;
          }

          /* Typography */
          body {
            font-family: 'Arial', sans-serif;
            color: #000;
            background: #fff;
          }

          h1 {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 10pt;
            page-break-after: avoid;
          }

          h2 {
            font-size: 18pt;
            font-weight: bold;
            margin-top: 15pt;
            margin-bottom: 8pt;
            page-break-after: avoid;
          }

          h3 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 10pt;
            margin-bottom: 5pt;
          }

          p {
            font-size: 11pt;
            line-height: 1.5;
            margin-bottom: 8pt;
          }

          /* Tables */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10pt 0;
            page-break-inside: avoid;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 8pt;
            text-align: left;
          }

          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }

          /* Lists */
          ul, ol {
            margin: 10pt 0;
            padding-left: 20pt;
          }

          li {
            margin-bottom: 5pt;
          }

          /* Page breaks */
          .page-break {
            page-break-before: always;
          }

          .no-break {
            page-break-inside: avoid;
          }

          /* Hide interactive elements */
          button, .btn, .no-print {
            display: none !important;
          }

          /* QR Code */
          .qr-code {
            width: 100px;
            height: 100px;
          }

          /* Header/Footer */
          .print-header {
            border-bottom: 2px solid #000;
            padding-bottom: 10pt;
            margin-bottom: 15pt;
          }

          .print-footer {
            border-top: 1px solid #ddd;
            padding-top: 10pt;
            margin-top: 15pt;
            font-size: 9pt;
            color: #666;
          }
        }
      `}</style>

      {/* Print Content (Hidden on screen) */}
      <div id="print-content" className="hidden print:block">
        <div className="print-header">
          <h1>🌍 {itinerary?.location || 'Travel Itinerary'}</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', color: '#666' }}>
            <div>
              <strong>Duration:</strong> {itinerary?.duration} days<br />
              <strong>Budget:</strong> ${itinerary?.budget}<br />
              <strong>Travelers:</strong> {itinerary?.participants} people
            </div>
            <div>
              <strong>Type:</strong> {itinerary?.type}<br />
              <strong>Generated:</strong> {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Itinerary Details */}
        {formattedResponse?.map((day, index) => (
          <div key={index} className="no-break" style={{ marginBottom: '20pt' }}>
            <h2>Day {index + 1}: {day.title}</h2>
            <ul>
              {day.items?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* Budget Summary */}
        {itinerary?.budget && (
          <div className="no-break page-break">
            <h2>💰 Budget Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Accommodation</td>
                  <td>${Math.round(itinerary.budget * 0.3)}</td>
                </tr>
                <tr>
                  <td>Food & Dining</td>
                  <td>${Math.round(itinerary.budget * 0.25)}</td>
                </tr>
                <tr>
                  <td>Activities</td>
                  <td>${Math.round(itinerary.budget * 0.2)}</td>
                </tr>
                <tr>
                  <td>Transport</td>
                  <td>${Math.round(itinerary.budget * 0.15)}</td>
                </tr>
                <tr>
                  <td>Miscellaneous</td>
                  <td>${Math.round(itinerary.budget * 0.1)}</td>
                </tr>
                <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                  <td>Total</td>
                  <td>${itinerary.budget}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Important Notes */}
        <div className="no-break">
          <h2>📝 Important Notes</h2>
          <ul>
            <li>Check visa requirements before travel</li>
            <li>Book accommodations in advance</li>
            <li>Keep emergency contacts handy</li>
            <li>Purchase travel insurance</li>
            <li>Verify activity timings before visiting</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="print-footer">
          <p>
            Generated by Travelly - AI Travel Planner<br />
            Visit travelly.com for more features<br />
            © {new Date().getFullYear()} Travelly. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default PrintVersion;
