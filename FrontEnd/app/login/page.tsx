"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    // Aqui você pode integrar com sua API de autenticação
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-green-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo */}
        <h1 className="mb-6 text-center text-2xl font-bold text-green-800">
          EcoTech DataFlow
        </h1>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-green-600 focus:ring focus:ring-green-200"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-green-600 focus:ring focus:ring-green-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-700 px-4 py-2 font-semibold text-white shadow hover:bg-green-800 transition"
          >
            Entrar
          </button>
        </form>

        {/* Links extras */}
        <div className="mt-4 flex justify-between text-sm text-green-700">
          <a href="#" className="hover:underline">
            Esqueceu a senha?
          </a>
          <a href="#" className="hover:underline">
            Criar conta
          </a>
        </div>
      </div>
    </div>
  );
}