import { useState } from "react";

function App() {
  const [token, setToken] = useState("");
  const [billId, setBillId] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(
        "whats the correct onrender urlhttps://clio-diagnostic-backend-1.onrender.com/diagnose",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, billId }),
        },
      );
      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError("Could not connect to server.");
    }
    setLoading(false);
  };

  const getSyncStatus = (bill) => {
    if (!bill) return null;
    if (bill.state === "awaiting_payment")
      return {
        syncs: true,
        message: "This bill is approved and will sync to QuickBooks.",
      };
    if (bill.state === "draft")
      return {
        syncs: false,
        message:
          "This bill is in draft state and will not sync to QuickBooks. Approve it in Clio to trigger sync.",
      };
    return {
      syncs: false,
      message: `Bill state is "${bill.state}" — verify this is eligible for sync.`,
    };
  };

  const syncStatus = results?.bill ? getSyncStatus(results.bill) : null;

  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
        Clio billing diagnostic tool
      </h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>
        Diagnose QuickBooks sync issues by checking bill state via the Clio API.
      </p>

      <div
        style={{
          background: "#f9f9f9",
          border: "1px solid #e5e5e5",
          borderRadius: 10,
          padding: "1.25rem",
          marginBottom: 24,
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              fontSize: 12,
              color: "#666",
              display: "block",
              marginBottom: 4,
            }}
          >
            Clio API token
          </label>
          <input
            type="text"
            placeholder="349170-xxxxxxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "1px solid #ddd",
              borderRadius: 6,
              fontSize: 13,
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 12,
              color: "#666",
              display: "block",
              marginBottom: 4,
            }}
          >
            Bill ID
          </label>
          <input
            type="text"
            placeholder="8950419"
            value={billId}
            onChange={(e) => setBillId(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "1px solid #ddd",
              borderRadius: 6,
              fontSize: 13,
            }}
          />
        </div>
        <button
          onClick={runDiagnostic}
          disabled={loading || !token || !billId}
          style={{
            background: "#0066cc",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontSize: 13,
            cursor: "pointer",
            opacity: loading || !token || !billId ? 0.5 : 1,
          }}
        >
          {loading ? "Running..." : "Run diagnostic"}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#fff0f0",
            border: "1px solid #ffcccc",
            borderRadius: 8,
            padding: "12px 16px",
            color: "#cc0000",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {results && (
        <div>
          {syncStatus && (
            <div
              style={{
                background: syncStatus.syncs ? "#f0fff4" : "#fff0f0",
                border: `1px solid ${syncStatus.syncs ? "#b3efc8" : "#ffcccc"}`,
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 16,
                fontSize: 13,
                color: syncStatus.syncs ? "#1a7a3a" : "#cc0000",
                fontWeight: 500,
              }}
            >
              {syncStatus.syncs ? "✓" : "✗"} {syncStatus.message}
            </div>
          )}

          <div style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: "1rem 1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "#999",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Bill
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 13, color: "#666" }}>ID</span>
                <span style={{ fontSize: 13 }}>{results.bill?.id}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 13, color: "#666" }}>Number</span>
                <span style={{ fontSize: 13 }}>#{results.bill?.number}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#666" }}>State</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color:
                      results.bill?.state === "awaiting_payment"
                        ? "#1a7a3a"
                        : "#cc6600",
                  }}
                >
                  {results.bill?.state}
                </span>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: "1rem 1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "#999",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Matter
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 13, color: "#666" }}>ID</span>
                <span style={{ fontSize: 13 }}>{results.matter?.id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#666" }}>Number</span>
                <span style={{ fontSize: 13 }}>
                  {results.matter?.display_number}
                </span>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: "1rem 1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "#999",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Contacts
              </p>
              {results.contacts?.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13, color: "#666" }}>{c.type}</span>
                  <span style={{ fontSize: 13 }}>{c.name}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: "1rem 1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "#999",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Time entries
              </p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#666" }}>
                  Total entries found
                </span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>
                  {results.timeEntries?.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
