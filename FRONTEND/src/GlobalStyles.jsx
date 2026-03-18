export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');

      @keyframes pulseR {
        0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(230,50,50,0.6); }
        50% { opacity: 0.4; box-shadow: none; }
      }
      @keyframes pulseOrb {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.15); }
      }
      @keyframes floatBg {
        0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
        50% { transform: translate(-50%, -50%) translateY(-20px); }
      }
      @keyframes scrollX {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes fadeY {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `}</style>
  );
}