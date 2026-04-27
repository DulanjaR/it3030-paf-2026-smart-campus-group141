import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Search, CalendarCheck, Ticket, Bell } from "lucide-react";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Welcome to Smart Campus Operations Hub
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Browse campus resources, request bookings, report maintenance issues,
              and track notifications in one simple platform.
            </p>

            <button
              onClick={() => navigate("/catalogue")}
              className="mt-8 bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-800 transition"
            >
              Explore Resources
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              What you can do
            </h2>

            <div className="grid grid-cols-1 gap-5">
              <FeatureCard
                icon={<Search />}
                title="Explore Resources"
                text="View lecture halls, labs, meeting rooms, and equipment."
              />

              <FeatureCard
                icon={<CalendarCheck />}
                title="Request Bookings"
                text="Submit booking requests for available campus resources."
              />

              <FeatureCard
                icon={<Ticket />}
                title="Report Issues"
                text="Create maintenance tickets for damaged or faulty resources."
              />

              <FeatureCard
                icon={<Bell />}
                title="Get Notifications"
                text="Receive updates about booking approvals and ticket progress."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border">
      <div className="text-blue-700 bg-blue-100 p-3 rounded-xl">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{text}</p>
      </div>
    </div>
  );
}