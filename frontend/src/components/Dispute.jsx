import { useState } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { getGSNSigner } from "../gsn";

export default function Dispute() {
  const [rideId, setRideId] = useState("");
  const [status, setStatus] = useState("");

  async function disputeRide(e) {
    e.preventDefault();
    setStatus("Submitting…");
    try {
      const signer = await getGSNSigner();
      const sdk = ThirdwebSDK.fromSigner(signer, { chainId: 1442 });
      const ledger = await sdk.getContract(process.env.REACT_APP_RIDE_LEDGER);
      const tx = await ledger.call("dispute", [rideId]);
      await tx.wait();
      setStatus("Dispute sent (gasless)");
    } catch (err) {
      console.error(err);
      setStatus("NAHH!!! Not wokring" + err.message);
    }
  }

  return (
    <form onSubmit={disputeRide} className="p-4 bg-slate-800 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Raise Dispute</h3>
      <input
        type="number"
        value={rideId}
        onChange={e => setRideId(e.target.value)}
        placeholder="Ride ID"
        className="input input-bordered w-full mb-2"
      />
      <button className="btn btn-warning w-full">Dispute Ride</button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </form>
  );
}
