import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Morse Code Encoder</h1>
          <p className="text-xl text-gray-600">
            A powerful tool to encode and decode Morse code with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <ul className="space-y-4 text-lg">
              <li>
                <strong>Multi-language Support:</strong> Encode and decode in
                English, Hindi, Marathi, and French.
              </li>
              <li>
                <strong>Text and File Processing:</strong> Handle both direct
                text input and file uploads for encoding and decoding.
              </li>
              <li>
                <strong>Secure Authentication:</strong> User accounts are
                protected with JWT-based authentication.
              </li>
              <li>
                <strong>Intuitive Interface:</strong> A clean and user-friendly
                design for a seamless experience.
              </li>
            </ul>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4">How it Works</h2>
            <p className="text-lg">
              Our application uses a sophisticated algorithm to convert text to
              Morse code and vice versa. Simply enter your text or upload a
              file, select the desired language, and let our tool do the rest.
              The encoded files are downloaded in a secure `.enc` format, and
              decoded text is displayed directly on the dashboard.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-block px-8 py-4 text-xl font-bold text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-16 text-center text-gray-600">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg">
            Have questions or feedback? Reach out to us at{" "}
            <a
              href="mailto:contact@morseencoder.com"
              className="text-black hover:underline"
            >
              contact@morseencoder.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}