import loserImg from "../assets/loser.png";
export default function Loser() {
  return (
    <div className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${loserImg})` }} />
  );
}