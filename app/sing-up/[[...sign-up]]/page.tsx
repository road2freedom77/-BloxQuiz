import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      position: "relative",
      zIndex: 1,
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 500,
        height: 500,
        background: "radial-gradient(circle, rgba(0,245,160,0.1), transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              background: "var(--gradient-main)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>BloxQuiz</span>
            <span style={{ color: "var(--neon-pink)", fontFamily: "var(--font-display)", fontSize: 32 }}>.gg</span>
          </a>
          <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginTop: 8 }}>
            Create your free account and start earning XP today!
          </p>
        </div>

        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#00F5A0",
              colorBackground: "#13172A",
              colorInputBackground: "#1A1F35",
              colorInputText: "#F0F4FF",
              colorText: "#F0F4FF",
              colorTextSecondary: "#8892B0",
              colorDanger: "#FF3CAC",
              borderRadius: "12px",
              fontFamily: "inherit",
            },
            elements: {
              card: {
                background: "#13172A",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                borderRadius: "16px",
              },
              headerTitle: {
                color: "#F0F4FF",
                fontWeight: 800,
              },
              headerSubtitle: {
                color: "#8892B0",
              },
              socialButtonsBlockButton: {
                background: "#1A1F35",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F0F4FF",
                borderRadius: "10px",
                fontWeight: 700,
              },
              socialButtonsBlockButtonText: {
                color: "#F0F4FF",
              },
              dividerLine: {
                background: "rgba(255,255,255,0.08)",
              },
              dividerText: {
                color: "#8892B0",
              },
              formFieldLabel: {
                color: "#8892B0",
                fontWeight: 700,
                fontSize: "13px",
              },
              formFieldInput: {
                background: "#1A1F35",
                border: "1.5px solid rgba(255,255,255,0.1)",
                color: "#F0F4FF",
                borderRadius: "10px",
              },
              formButtonPrimary: {
                background: "linear-gradient(135deg, #00F5A0, #B84CFF)",
                color: "#0B0E17",
                fontWeight: 900,
                borderRadius: "100px",
                border: "none",
              },
              footerActionLink: {
                color: "#00F5A0",
                fontWeight: 700,
              },
              identityPreviewText: {
                color: "#F0F4FF",
              },
              identityPreviewEditButton: {
                color: "#00F5A0",
              },
            }
          }}
        />
      </div>
    </div>
  );
}