# Detects anomalies in logs based on predefined rules. For now, only logs on Error and high latency are considered anomalies.
def is_anomalous(log: dict) -> bool:
    # Rule 1: Any ERROR-level log is an anomaly
    if log.get("level") == "ERROR":
        return True

    # Rule 2: Latency too high
    latency = log.get("latency_ms")
    if latency is not None and latency > 3000:
        return True

    return False
