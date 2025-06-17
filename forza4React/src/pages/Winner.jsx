import winnerImg from "../assets/winner.png";
export default function Winner() {
  return (
    <div className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${winnerImg})` }} />
  );
}