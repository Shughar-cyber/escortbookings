import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";

export default function App() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [appointmentCode, setAppointmentCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Modal states
  const [modalType, setModalType] = useState(null);
  const [lookupCode, setLookupCode] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase();
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    const code = `APT-${randomLetters}${randomNumbers}`;

    const formData = new FormData(form.current);
    const details = {
      clientName: formData.get("full_name"),
      phone: formData.get("phone"),
      location: formData.get("location"),
      age: formData.get("age"),
      escort: formData.get("profile"),
      date: formData.get("date"),
      time: formData.get("time"),
      service: formData.get("service"),
      modeOfVisit: formData.get("appointment_type"),
      bookingFee: formData.get("duration"),
      paymentMethod: formData.get("payment_method"),
    };

    const emailData = { ...details, appointment_code: code };

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setIsSubmitting(false);
          setAppointmentCode(code);
          setBookingDetails(details);
          const bookings = JSON.parse(localStorage.getItem("bookings") || "{}");
          bookings[code] = { ...details, appointment_code: code, bookedAt: new Date().toISOString() };
          localStorage.setItem("bookings", JSON.stringify(bookings));
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        (error) => {
          setIsSubmitting(false);
          console.error(error);
          alert("Failed to send email. Error: " + (error.text || error.message || "Unknown error"));
        }
      );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(appointmentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openModal = (type) => { setModalType(type); setLookupCode(""); setLookupResult(null); setLookupError(""); };
  const closeModal = () => { setModalType(null); setLookupCode(""); setLookupResult(null); setLookupError(""); };

  const handleLookup = () => {
    const code = lookupCode.trim().toUpperCase();
    if (!code) { setLookupError("Please enter your appointment code."); return; }
    const bookings = JSON.parse(localStorage.getItem("bookings") || "{}");
    const found = bookings[code];
    if (found) { setLookupResult(found); setLookupError(""); }
    else { setLookupResult(null); setLookupError("No appointment found with that code. Please check and try again."); }
  };

  /* Shared input classes */
  const inputClass = "w-full px-5 py-3.5 sm:py-4 rounded-2xl border border-gray-200/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 input-glow transition-all duration-300 text-sm placeholder-gray-400 hover:border-pink-200 shadow-sm hover:shadow-md";
  const selectClass = `${inputClass} appearance-none text-gray-600`;

  const SelectArrow = () => (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  );

  const DetailRow = ({ label, value, uppercase }) => (
    <div className="flex justify-between items-center py-3.5 border-b border-gray-100/80 last:border-0 group hover:bg-pink-50/30 px-2 -mx-2 rounded-lg transition-colors duration-200">
      <span className="text-gray-400 font-medium text-xs sm:text-sm">{label}</span>
      <span className={`font-bold text-gray-800 text-xs sm:text-sm ${uppercase ? "uppercase" : ""}`}>{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff0f8] via-[#ffe5f5] to-[#fbd5ec] relative flex flex-col items-center py-10 sm:py-16 px-4 font-sans text-gray-700 overflow-hidden">

      {/* Decorative floating orbs */}
      <div className="fixed top-[-5%] left-[-8%] w-80 h-80 bg-gradient-to-br from-pink-300 to-rose-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 animate-float pointer-events-none"></div>
      <div className="fixed bottom-[-5%] right-[-8%] w-[30rem] h-[30rem] bg-gradient-to-tl from-fuchsia-200 to-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-float-slow pointer-events-none"></div>
      <div className="fixed top-[40%] right-[10%] w-40 h-40 bg-rose-200 rounded-full mix-blend-multiply filter blur-[60px] animate-pulse2 pointer-events-none"></div>
      <div className="fixed top-[20%] left-[15%] w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-[40px] animate-pulse2 pointer-events-none" style={{ animationDelay: "1.5s" }}></div>

      {!bookingDetails ? (
        <>
          {/* ============ BOOKING FORM VIEW ============ */}

          {/* Header */}
          <div className="relative z-10 text-center mb-10 sm:mb-14 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-pink-200/50 rounded-full px-5 py-2 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#de5c8e] animate-pulse"></span>
              <span className="text-[#bf4576] font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase">
                Appointment
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-semibold text-gray-800 mb-5 tracking-tight leading-tight">
              Book Your <span className="bg-gradient-to-r from-[#c24676] to-[#de5c8e] bg-clip-text text-transparent">Appointment</span>
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base font-light max-w-md mx-auto leading-relaxed">
              Complete the form below to schedule your Escort or Massage appointment.
            </p>
          </div>

          {/* Form Card */}
          <div className="relative z-10 w-full max-w-2xl glass-card rounded-[2rem] shadow-xl shadow-pink-200/20 p-6 sm:p-10 mb-10 animate-fade-up-delay-1">

            <form ref={form} onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div className="animate-fade-up stagger-1">
                <label className="block text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2.5 ml-1">Name</label>
                <input type="text" name="full_name" placeholder="Enter your name" className={inputClass} required />
              </div>

              {/* Phone or Email */}
              <div className="animate-fade-up stagger-2">
                <label className="block text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2.5 ml-1">Phone Number or Email</label>
                <input type="text" name="phone" placeholder="Phone number or email" className={inputClass} required />
              </div>

              {/* Address */}
              <div className="animate-fade-up stagger-3">
                <label className="block text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2.5 ml-1">Client's Address</label>
                <input type="text" name="location" placeholder="Enter Address" className={inputClass} required />
              </div>

              {/* Age */}
              <div className="animate-fade-up stagger-4">
                <label className="block text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2.5 ml-1">Age</label>
                <div className="relative">
                  <select name="age" className={selectClass} required defaultValue="">
                    <option value="" disabled>Select age</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-45">36-45</option>
                    <option value="46-55">46-55</option>
                    <option value="55+">55+</option>
                  </select>
                  <SelectArrow />
                </div>
              </div>

              {/* Escort */}
              <div className="animate-fade-up stagger-5">
                <label className="block text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2.5 ml-1">Name of Escort</label>
                <div className="relative">
                  <select name="profile" className={selectClass} required defaultValue="">
                    <option value="" disabled>Select escort</option>
                    <option value="any">Any Available</option>
                    <option value="escort1">Escort 1</option>
                    <option value="escort2">Escort 2</option>
                  </select>
                  <SelectArrow />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-up stagger-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2.5 ml-1">Date of Appointment</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      className={`${inputClass} [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer z-10 bg-transparent`}
                      required
                    />
                    <div className="absolute inset-0 bg-white/90 rounded-2xl -z-10"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 z-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2.5 ml-1">Time of Appointment</label>
                  <div className="relative">
                    <select name="time" className={selectClass} required defaultValue="">
                      <option value="" disabled>Select time</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                    <SelectArrow />
                  </div>
                </div>
              </div>

              {/* Mode of Visit */}
              <div className="animate-fade-up stagger-7">
                <label className="block text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2.5 ml-1">Mode of Visit</label>
                <div className="relative">
                  <select name="appointment_type" className={selectClass} required defaultValue="">
                    <option value="" disabled>Select mode of visit</option>
                    <option value="Incall">Incall</option>
                    <option value="Outcall">Outcall</option>
                  </select>
                  <SelectArrow />
                </div>
              </div>

              {/* Service */}
              <div className="animate-fade-up stagger-8">
                <label className="block text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2.5 ml-1">Service Needed</label>
                <div className="relative">
                  <select name="service" className={selectClass} required defaultValue="">
                    <option value="" disabled>Select service</option>
                    <option value="Massage">Massage</option>
                    <option value="Escort">Escort</option>
                    <option value="Both">Both</option>
                  </select>
                  <SelectArrow />
                </div>
              </div>

              {/* Booking Fee */}
              <div className="animate-fade-up stagger-9">
                <label className="block text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2.5 ml-1">Booking Fee</label>
                <div className="relative">
                  <select name="duration" className={selectClass} required defaultValue="">
                    <option value="" disabled>Select amount</option>
                    <option value="$50">$50</option>
                    <option value="$75">$75</option>
                    <option value="$100">$100</option>
                    <option value="$125">$125</option>
                    <option value="$150">$150</option>
                    <option value="$200">$200</option>
                    <option value="$250">$250</option>
                  </select>
                  <SelectArrow />
                </div>
              </div>

              {/* Payment Method */}
              <div className="animate-fade-up stagger-10">
                <label className="block text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-2.5 ml-1">Payment Method <span className="normal-case tracking-normal font-medium text-gray-400">( Conclude payment means with the escort )</span></label>
                <div className="relative">
                  <select name="payment_method" className={selectClass} required defaultValue="">
                    <option value="" disabled>Select payment method</option>
                    <option value="BITCOIN">BITCOIN</option>
                    <option value="Gift Card">Gift Card (APPLE, XBOX & STEAM GIFT CARD ONLY)</option>
                    <option value="Cash App">Cash App</option>
                    <option value="Zelle">Zelle</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Venmo">Venmo</option>
                    <option value="Chime">Chime</option>
                  </select>
                  <SelectArrow />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-8 flex flex-col items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-premium text-white font-bold py-4 px-14 rounded-full text-sm tracking-[0.2em] uppercase min-w-[220px] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3 justify-center">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Booking...
                    </span>
                  ) : "Book Now"}
                </button>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-5 text-center font-light">
                  Please make sure all appointment information is correct before booking.
                </p>
              </div>
            </form>
          </div>

          {/* Manage Appointment Section */}
          <div className="relative z-10 w-full max-w-2xl glass-card rounded-[2rem] shadow-lg shadow-pink-200/15 p-6 sm:p-10 animate-fade-up-delay-3">
            <h2 className="text-center text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-6">
              Manage Your Appointment
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => openModal("confirm")}
                className="w-full border border-pink-200/60 bg-white/70 hover:bg-white text-[#c24676] font-bold py-3.5 sm:py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-sm hover:-translate-y-0.5 group"
              >
                <span className="group-hover:tracking-wider transition-all duration-300">Appointment Confirmation</span>
              </button>
              <button
                onClick={() => openModal("reschedule")}
                className="w-full border border-pink-200/60 bg-white/70 hover:bg-white text-[#c24676] font-bold py-3.5 sm:py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-sm hover:-translate-y-0.5 group"
              >
                <span className="group-hover:tracking-wider transition-all duration-300">Reschedule Appointment</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        /* ============ SUCCESS VIEW ============ */
        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">

          {/* Header */}
          <div className="text-center mb-10 sm:mb-14 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-pink-200/50 rounded-full px-5 py-2 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[#bf4576] font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase">
                Confirmed
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 mb-5 tracking-tight leading-tight">
              Your Appointment<br />Has Been <span className="bg-gradient-to-r from-[#c24676] to-[#de5c8e] bg-clip-text text-transparent">Booked</span>
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm font-light">
              Your appointment has been successfully booked.
            </p>
          </div>

          {/* Confirmation Card */}
          <div className="w-full bg-white rounded-[2rem] shadow-xl shadow-pink-200/20 p-8 sm:p-12 mb-8 flex flex-col items-center animate-scale-in">

            {/* Animated Checkmark */}
            <div className="w-20 h-20 bg-gradient-to-br from-[#de5c8e] to-[#c24676] rounded-full flex items-center justify-center mb-7 shadow-lg shadow-pink-300/40 animate-checkmark">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Booking Confirmed</h2>
            <p className="text-gray-400 text-sm text-center mb-10 px-4 font-light max-w-md leading-relaxed">
              Your appointment has been successfully recorded. Keep your appointment code safe because it is used to identify this appointment.
            </p>

            {/* Appointment Code */}
            <div className="w-full bg-gradient-to-br from-[#fdf5f9] to-[#fef0f5] border border-[#fce4ef] rounded-2xl p-7 flex flex-col items-center mb-10 relative overflow-hidden">
              <div className="shimmer-border absolute inset-0 rounded-2xl"></div>
              <p className="text-[#bf4576] text-[10px] font-bold tracking-[0.2em] uppercase mb-3 relative z-10">
                Your Appointment Code Is
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-[0.15em] mb-6 relative z-10">
                {appointmentCode}
              </p>
              <button
                onClick={handleCopy}
                className="btn-premium text-white text-xs font-bold py-3 px-8 rounded-full tracking-[0.15em] uppercase relative z-10"
              >
                {copied ? "✓ COPIED!" : "COPY CODE"}
              </button>
            </div>

            {/* Details */}
            <div className="w-full animate-fade-up-delay-2">
              <h3 className="text-[#bf4576] text-[10px] font-bold tracking-[0.2em] uppercase mb-5">
                Appointment Details
              </h3>
              <div className="divide-y divide-gray-100/80">
                <DetailRow label="Client Name" value={bookingDetails.clientName} />
                <DetailRow label="Escort" value={bookingDetails.escort} />
                <DetailRow label="Date" value={bookingDetails.date} />
                <DetailRow label="Time" value={bookingDetails.time} />
                <DetailRow label="Service" value={bookingDetails.service} />
                <DetailRow label="Mode of Visit" value={bookingDetails.modeOfVisit} uppercase />
                <DetailRow label="Booking Fee" value={bookingDetails.bookingFee} />
                <DetailRow label="Payment Method" value={bookingDetails.paymentMethod} />
              </div>
            </div>

            <div className="mt-10 text-center px-4">
              <p className="text-gray-400 text-xs mb-2 font-light leading-relaxed">
                Keep your appointment code safe and available. You may be asked to provide it when confirming or rescheduling this appointment.
              </p>
              <p className="text-[#c24676] text-xs font-bold mt-3">
                Do not lose your appointment code.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============ LOOKUP MODAL ============ */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4 animate-fade-in" onClick={closeModal}>
          <div
            className="bg-white rounded-[2rem] shadow-2xl shadow-pink-300/20 w-full max-w-lg p-8 sm:p-10 relative animate-scale-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={closeModal} className="absolute top-5 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-all duration-200 text-lg">
              ×
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center">
              {modalType === "confirm" ? "Appointment Confirmation" : "Reschedule Appointment"}
            </h2>
            <p className="text-gray-400 text-xs text-center mb-7 font-light">
              Enter your appointment code to {modalType === "confirm" ? "view your booking details" : "reschedule your appointment"}.
            </p>

            {/* Search Bar */}
            <div className="flex gap-3 mb-5">
              <input
                type="text"
                placeholder="e.g. APT-XYZ1234"
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                className="flex-1 px-5 py-3.5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 input-glow transition-all duration-300 text-sm uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
              />
              <button onClick={handleLookup} className="btn-premium text-white text-xs font-bold py-3.5 px-6 rounded-2xl tracking-wider uppercase">
                Search
              </button>
            </div>

            {lookupError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 animate-slide-down">
                <p className="text-red-500 text-xs text-center">{lookupError}</p>
              </div>
            )}

            {lookupResult && (
              <div className="mt-4 border-t border-gray-100 pt-6 animate-fade-up">
                <div className="bg-gradient-to-br from-[#fdf5f9] to-[#fef0f5] border border-[#fce4ef] rounded-xl p-5 mb-6 text-center">
                  <p className="text-[#bf4576] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Appointment Code</p>
                  <p className="text-xl font-bold text-gray-800 tracking-[0.1em]">{lookupResult.appointment_code}</p>
                </div>

                <div className="space-y-0">
                  <DetailRow label="Client Name" value={lookupResult.clientName} />
                  <DetailRow label="Escort" value={lookupResult.escort} />
                  <DetailRow label="Date" value={lookupResult.date} />
                  <DetailRow label="Time" value={lookupResult.time} />
                  <DetailRow label="Service" value={lookupResult.service} />
                  <DetailRow label="Mode of Visit" value={lookupResult.modeOfVisit} uppercase />
                  <DetailRow label="Booking Fee" value={lookupResult.bookingFee} />
                  <DetailRow label="Payment Method" value={lookupResult.paymentMethod} />
                </div>

                {modalType === "reschedule" && (
                  <p className="text-center text-gray-400 text-xs mt-6 font-light leading-relaxed">
                    To reschedule, please book a new appointment with your updated details and contact support with both appointment codes.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
