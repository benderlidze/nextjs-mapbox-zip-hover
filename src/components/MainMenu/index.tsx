export const MainMenu = () => {
  return (
    <div
      style={{
        height: "100px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="/Mapzlogo.png" alt="logo" />
        <h1>Mapz</h1>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <a href="">About</a>
        <a href="">Contact</a>
      </div>
    </div>
  );
};
