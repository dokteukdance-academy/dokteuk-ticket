"use client";

import { useEffect, useState } from "react";

export default function CancelPage() {
  const [reservationNumber, setReservationNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cancelComplete, setCancelComplete] = useState(false);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);

    const numberFromUrl =
      currentUrl.searchParams.get("reservation") ??
      currentUrl.searchParams.get("reservationNumber") ??
      "";

    setReservationNumber(numberFromUrl.trim().toUpperCase());
  }, []);

  const handleCancel = async () => {
    const normalizedNumber = reservationNumber.trim().toUpperCase();

    if (!normalizedNumber) {
      setMessage("예매번호를 입력해주세요.");
      return;
    }

    const confirmed = window.confirm(
      "정말 예매를 취소하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/reservation/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationNumber: normalizedNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCancelComplete(true);
        setMessage("예매가 정상적으로 취소되었습니다.");
      } else {
        setMessage(
          data.message || "예매 취소에 실패했습니다."
        );
      }
    } catch (error) {
      console.error("취소 요청 오류:", error);
      setMessage("서버 연결 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (cancelComplete) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "40px 20px",
          background: "#f7f7f7",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "420px",
            marginTop: "80px",
            padding: "36px 28px",
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              marginBottom: "16px",
            }}
          >
            ✅
          </div>

          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "28px",
              color: "#111111",
            }}
          >
            예매 취소 완료
          </h1>

          <p
            style={{
              margin: "0 0 24px",
              color: "#666666",
              lineHeight: 1.6,
            }}
          >
            예매가 정상적으로 취소되었습니다.
          </p>

          <div
            style={{
              padding: "18px",
              borderRadius: "10px",
              background: "#f4f4f4",
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                color: "#777777",
                fontSize: "14px",
              }}
            >
              취소된 예매번호
            </p>

            <strong
              style={{
                color: "#111111",
                fontSize: "21px",
              }}
            >
              {reservationNumber}
            </strong>
          </div>

          <p
            style={{
              marginTop: "24px",
              color: "#888888",
              fontSize: "14px",
            }}
          >
            이제 이 페이지를 닫아도 됩니다.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f7f7f7",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          height: "fit-content",
          padding: "28px",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            marginTop: 0,
            color: "#111111",
          }}
        >
          예매 취소
        </h1>

        <p
          style={{
            color: "#666666",
            lineHeight: 1.6,
          }}
        >
          문자로 안내받은 예매번호를 확인한 후 취소해주세요.
        </p>

        <input
          value={reservationNumber}
          onChange={(event) =>
            setReservationNumber(
              event.target.value.toUpperCase()
            )
          }
          placeholder="예매번호를 입력해주세요"
          disabled={loading}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px",
            border: "1px solid #dddddd",
            borderRadius: "8px",
            fontSize: "16px",
            color: "#111111",
            backgroundColor: "#ffffff",
          }}
        />

        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "14px",
            border: 0,
            borderRadius: "8px",
            background: loading ? "#888888" : "#111111",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "처리 중..." : "예매 취소"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "18px",
              textAlign: "center",
              color: "#111111",
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
        )}
      </section>
    </main>
  );
}