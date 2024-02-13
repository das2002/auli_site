const Logo = ({height, marginY, marginX}) => {
  return (
    <div className={`logo-container my-${marginY} mx-${marginX}`}>
      <img
        className={`h-${height} w-auto`}
        src={require("../../../images/icononly_transparent_nobuffer.png")}
        alt="Auli logo"
      />
    </div>
  );
}

export default Logo;
