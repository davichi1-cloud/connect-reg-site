"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function Home() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    denomination: "",
    health: "",
    expectation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.name || !form.email) {
      alert("Please fill in required fields");
      return;
    }

    // جلوگیری از ایمیل تکراری
    const existing = JSON.parse(localStorage.getItem("registeredEmails") || "[]");
    if (existing.includes(form.email)) {
      alert("This email is already registered!");
      return;
    }

    setLoading(true);

    // ✅ MATCHES GOOGLE SCRIPT
    const fullData = {
      name: form.name,
      email: form.email,
      gender: form.gender,
      denomination: form.denomination,
      health: form.health,
      expectations: form.expectation, // ✅ FIXED KEY
    };

    try {
      // ✅ FETCH WITH RESPONSE
      const res = await fetch(
        NEXT_PUBLIC_GOOGLE_SCRIPT_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify(fullData),
        }
      );

      let result = {};
try {
  result = await res.json();
} catch (e) {
  console.log("Response parse failed");
} 
      const tribe = result.tribe;
      const code = result.code;

      // ✅ EMAILJS (UNCHANGED SETTINGS)
      await emailjs.send(
        NEXT_PUBLIC_EMAILJS_SERVICE,
       NEXT_PUBLIC_EMAILJS_TEMPLATE ,
        {
          name: form.name,
          email: form.email,
          tribe,
          code,
        },
        NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      // SAVE EMAIL
      localStorage.setItem(
        "registeredEmails",
        JSON.stringify([...existing, form.email])
      );

      // REDIRECT WITH CORRECT DATA
      router.push(
        `/confirmation?name=${form.name}&email=${form.email}&gender=${form.gender}&tribe=${tribe}&code=${code}`
      );

    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <img src="/logo.jpg" className="logo" alt="logo" />
        <p className="theme">RETREAT THEME</p>
        <h1>Ministers and Workers Retreat</h1>
        <p className="quote">
          “But they that wait upon the Lord shall renew their strength...”
        </p>
        <div className="line"></div>
        <p className="desc">
          To lead ministers and workers into a season of waiting on the Lord,
          renewal, and preparation for greater impact.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h2>Registration form</h2>
        <p className="sub">Register for the retreat</p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Full name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email address"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <select
            required
            value={form.denomination}
            onChange={(e) =>
              setForm({ ...form, denomination: e.target.value })
            }
          >
            <option value="">Select denomination</option>
            <option>RCCG</option>
            <option>Living Faith (Winners)</option>
            <option>Apostolic Faith</option>
            <option>Deeper Life</option>
            <option>Christ Embassy</option>
            <option>Mountain of Fire</option>
            <option>Anglican</option>
            <option>Catholic</option>
            <option>Methodist</option>
            <option>Presbyterian</option>
            <option>Other</option>
          </select>

          <select
            required
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value })
            }
          >
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          {/* HEALTH */}
          <textarea
            placeholder="Any health issues?"
            value={form.health}
            onChange={(e) =>
              setForm({ ...form, health: e.target.value })
            }
          />

          {/* ✅ FIXED EXPECTATION */}
          <textarea
            className="expectation-box"
            placeholder="What are your expectations for the retreat?"
            value={form.expectation}
            onChange={(e) =>
              setForm({ ...form, expectation: e.target.value })
            }
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Complete registration"}
          </button>
        </form>
      </div>
    </div>
  );
}



