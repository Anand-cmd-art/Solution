import { useState } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useAccount } from "wagmi";
import { getGSNSigner } from "../gsn";

export default function RideLookup() {
  const [rideId, setRideId] = useState("");
  const [ride, setRide]   = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchRide() {
    setLoading(true);
    try {
      const signer = await getGSNSigner();
      const sdk = ThirdwebSDK.fromSigner(signer, { chainId: 1442 }); // zkEVM-cardona
      const ledger = await sdk.getContract(process.env.REACT_APP_RIDE_LEDGER);
      const data = await ledger.call("rides", [rideId]);
      setRide(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  return (
    <div className="p-4 rounded bg-slate-800 shadow">
      <h3 className="text-lg font-semibold mb-2">Lookup Ride</h3>
      <input
        type="number"
        value={rideId}
        onChange={e => setRideId(e.target.value)}
        placeholder="Ride ID"
        className="input input-bordered w-full mb-2"
      />
      <button onClick={fetchRide} className="btn btn-primary w-full">
        {loading ? "Loading…" : "Fetch"}
      </button>

      {ride && (
        <pre className="mt-4 bg-slate-900 p-3 rounded text-sm overflow-x-auto">
{JSON.stringify({
  fare: ride.split.riderPaid.toString(),
  driver: ride.driver,
  rider: ride.rider,
  disputed: ride.disputed
}, null, 2)}
        </pre>
      )}
    </div>
  );
}
