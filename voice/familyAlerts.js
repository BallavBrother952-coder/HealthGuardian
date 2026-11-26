// Simulated family alert (prototype only)
export function sendFamilyAlert(patientName, message) {
    const alert = {
        patientName,
        message,
        status: "SIMULATED",
        createdAt: new Date().toISOString()
    };

    console.log("Family Alert:", alert);

    return alert;
}