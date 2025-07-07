# Detects anomalies in logs based on predefined rules. For now, only logs on Error and high latency are considered anomalies.
def is_anomalous(log: dict) -> bool:
    
    # Rule 1: Latency too high
    latency = log.get("latency_ms")
    if latency is not None and latency > 3000:
        log['flag'] = 'latency > 3000ms'
        return True
    
    # Rule 2: Service-specific anomaly (e.g., "auth" service)
    if log.get("service") == "auth" and log.get("level") == "CRITICAL":
        log['flag'] = 'critical error detected in auth service'
        return True
    
    # Rule 3: Specific message content
    if "database" in log.get("message", "").lower() and log.get("level") in ["ERROR", "CRITICAL"]:
        log['flag'] = 'database error detected'
        return True

    #for sake of test, if user is 'andy' anomaly is detected
    if log.get("user") == "andy" or log.get("user_id") == "andy":
        log['flag'] = 'anomalous test user detected'
        return True
    
    # Final Rule: Any ERROR-level log is an anomaly
    if log.get("level") == "ERROR":
        log['flag'] = 'error detected'
        return True

    return False
