from fastapi import FastAPI, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.anomaly_detector import is_anomalous
import uvicorn

app = FastAPI()

# Temporary log storage
logs = []
anomalies = []

# For dev: Allow frontend to connect via WebSocket
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket endpoint for real-time updates
connected_clients = []

@app.websocket("/ws/logs")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # keep the socket alive
    except:
        connected_clients.remove(websocket)

@app.post("/logs")
async def receive_logs(request: Request):
    try:
        payload = await request.json()
        logs.append(payload)

        # Check for anomaly
        if is_anomalous(payload):
            print("🚨 Anomaly detected:", payload)
            anomalies.append(payload)

        # 🔥 Broadcast log to connected WebSocket clients
        disconnected_clients = []
        for client in connected_clients:
            try:
                await client.send_json(payload)
            except Exception as e:
                print("WebSocket error:", e)
                disconnected_clients.append(client)

        # Clean up disconnected clients
        for client in disconnected_clients:
            connected_clients.remove(client)

        return {"message": "Log received", "log_count": len(logs)}

    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    
    # TODO: Update anomalies list when anomaly is detected with new websocket approach. (DONE*) Completed in anomaly_detector.py + filtering on frontend using same websocket connection
    # TODO: retrieve older logs if webpage is refreshed. (DONE*) Completed on client side frontend

@app.get("/logs")
def get_logs():
    return {"logs": logs}

@app.get("/anomalies")
def get_anomalies():
    return {"anomalies": anomalies}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
