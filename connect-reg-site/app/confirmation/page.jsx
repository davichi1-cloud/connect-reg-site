"use client";

import { useSearchParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { useRef } from "react";

export default function Confirmation() {
  const params = useSearchParams();
  const router = useRouter();
  const cardRef = useRef();

  const name = params.get("name");
  const email = params.get("email");
  const gender = params.get("gender");
  const tribe = params.get("tribe");
  const code = params.get("code");

  const downloadImage = async () => {
    const canvas = await html2canvas(cardRef.current);
    const link = document.createElement("a");
    link.download = `${name}-ticket.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="confirm-wrapper">
      <div className="confirm-card" ref={cardRef}>

        <h2>Registration Successful!</h2>
        <p>Your details have been received</p>

        <div className="confirm-details">
          <p><b>Name:</b> {name}</p>
          <p><b>Email:</b> {email}</p>
          <p><b>Gender:</b> {gender}</p>
          <p><b>Tribe:</b> {tribe}</p>
          <p><b>Code:</b> {code}</p>
        </div>

        <QRCode value={`${name} | ${code} | ${tribe}`} size={150} />

        <div className="button-group">
          <button className="btn download" onClick={downloadImage}>
            Download Full Ticket
          </button>

          <button className="btn home" onClick={() => router.push("/")}>
            Go Home
          </button>
        </div>

      </div>
    </div>
  );
} 
