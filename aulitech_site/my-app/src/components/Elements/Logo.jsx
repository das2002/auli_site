export default function Logo({height, marginY, marginX}) {
  console.log(height, marginY)
  return (
    <div>
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