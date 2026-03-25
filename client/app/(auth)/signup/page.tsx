"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { register, isRegistering } = useAuth();
  const router = useRouter();

  const validateInputs = () => {
    // Phone Validation: exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMsg("Phone number must be exactly 10 digits.");
      return false;
    }
    
    // Aadhar Validation: exactly 12 digits
    const aadharRegex = /^[0-9]{12}$/;
    if (!aadharRegex.test(aadhar)) {
      setErrorMsg("Aadhar Card number must be exactly 12 digits.");
      return false;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!validateInputs()) return;

    try {
      // Note: Make sure your register hook/backend accepts phone and aadhar if required
      await register({ name, email, password, phone, aadhar });
      router.push("/items");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to register. Please try again.");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-center text-neutral-100 mb-6">Create Account</h1>
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-sm mb-4">
          {errorMsg}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-1.5">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-400 mb-1.5">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="input-field"
              placeholder="10-digit mobile"
              required
            />
          </div>
          <div>
            <label htmlFor="aadhar" className="block text-sm font-medium text-neutral-400 mb-1.5">
              Aadhar Number
            </label>
            <input
              id="aadhar"
              type="text"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value.replace(/\D/g, '').slice(0, 12))}
              className="input-field"
              placeholder="12-digit number"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-400 mb-1.5">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Minimum 6 characters"
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={isRegistering}
          className="w-full btn-primary mt-2 disabled:opacity-50 flex items-center justify-center py-2.5"
        >
          {isRegistering ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-neutral-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 font-medium hover:text-blue-400 transition-colors">
          Sign in
        </Link>
      </p>
    </>
  );
}
