"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력하세요.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("로그인 성공!");

      router.push("/admin");
    } catch (error) {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 border border-gray-700 p-8">

        <h1 className="text-4xl font-bold text-white text-center">
          관리자 로그인
        </h1>

        <p className="text-gray-400 text-center mt-3">
          관리자만 접근 가능합니다.
        </p>

        <div className="mt-8 space-y-4">

          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-gray-800 p-4 text-white outline-none"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-gray-800 p-4 text-white outline-none"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-lg bg-yellow-500 py-4 font-bold text-black hover:bg-yellow-400 disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

        </div>

      </div>
    </main>
  );
}