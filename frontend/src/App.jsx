import RideLookup from "./components/RideLookup";
import Dispute from "./components/Dispute";

export default function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center">
      <header className="py-6">
        <h1 className="text-3xl font-bold">OpenFare Demo (zkEVM + GSN)</h1>
        <p className="text-sm opacity-70 text-center">
          Gas-free ride transparency
        </p>
      </header>
      <section className="grid gap-6 w-full max-w-xl px-4">
        <RideLookup />
        <Dispute />
      </section>
    </main>
  );
}
