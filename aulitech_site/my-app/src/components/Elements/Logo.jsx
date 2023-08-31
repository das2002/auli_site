const Logo = ({height, marginY, marginX}) => {
  return (
    <div className={`my-${marginY} mx-${marginX}`}>
      <div className={`flex my-${marginY} mx-${marginX} shrink-0 justify-center`}>
        <img
          className={`h-${height} w-auto`}
          src={require("../../images/icononly_transparent_nobuffer.png")}
          alt="Auli logo"
        />
      </div>
    </div>
  );
}

export default Logo;