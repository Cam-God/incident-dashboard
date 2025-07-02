from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.anomaly_detector import is_anomalous
import uvicorn

app = FastAPI()

# Temporary log storage
logs = []
anomalies = []

@app.post("/logs")
async def receive_logs(request: Request):
    try:
        payload = await request.json()
        logs.append(payload)
        
        if is_anomalous(payload):
            print("🚨 Anomaly detected:", payload)
            anomalies.append(payload)
        
        # print("Received log:", payload)  # Just reference for now
        return {"message": "Log received", "log_count": len(logs)}
        # Worked, with this console print in the running terminal: 
        # Received log: {'timestamp': '2025-07-01T12:00:00Z', 'service': 'auth-service', 'level': 'ERROR', 'message': 'Failed login attempt', 'user_id': 'abc123'}
        # INFO:     127.0.0.1:57682 - "POST /logs HTTP/1.1" 200 OK
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

@app.get("/logs")
def get_logs():
    return {"logs": logs}

@app.get("/anomalies")
def get_anomalies():
    return {"anomalies": anomalies}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
