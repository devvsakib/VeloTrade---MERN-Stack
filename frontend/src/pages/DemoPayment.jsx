import { useNavigate } from "react-router-dom";
// Just for demo purposes
// /demo-sslcommerz, /demo-bkash, /demo-nagad
// You can later replace these with real API calls

export function DemoPayment({ gateway }) {
    const navigate = useNavigate();
    const handleSuccess = () => navigate("/success");
    const handleFail = () => navigate("/failed");


    return (
        <div className="p-4 text-center">
            <h1 className="text-2xl font-bold mb-2">{gateway} Demo Payment</h1>
            <p className="mb-4">This is a demo. Click below to simulate payment.</p>
            <div className="flex justify-center gap-4">
                <button className="bg-green-500 px-4 py-2 rounded" onClick={handleSuccess}>Success</button>
                <button className="bg-red-500 px-4 py-2 rounded" onClick={handleFail}>Fail</button>
            </div>
        </div>
    )
}
