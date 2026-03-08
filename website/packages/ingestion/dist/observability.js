/**
 * Simple observability for ingestion: log events (no PII).
 * Can be replaced with metrics/OTEL later.
 */
/** In-memory log sink for tests or simple debugging. */
const defaultLog = [];
function emit(ev) {
    const entry = { ...ev, at: new Date().toISOString() };
    defaultLog.push(entry);
    if (process.env.NODE_ENV !== "test") {
        console.log("[ingestion]", JSON.stringify(entry));
    }
}
/**
 * Default observability implementation: logs to console and optional in-memory buffer.
 */
export function createObservability(buffer) {
    const log = buffer ?? defaultLog;
    return {
        onStart(connectorId) {
            const ev = { connectorId, event: "start" };
            log.push({ ...ev, at: new Date().toISOString() });
            emit(ev);
        },
        onItem(connectorId, kind, count) {
            emit({ connectorId, event: "item", kind, count });
        },
        onWarning(connectorId, message) {
            emit({ connectorId, event: "warning", message });
        },
        onError(connectorId, message) {
            emit({ connectorId, event: "error", message });
        },
        onEnd(connectorId, durationMs, totalItems) {
            emit({ connectorId, event: "end", durationMs, totalItems });
        },
    };
}
export function getLog() {
    return [...defaultLog];
}
export function clearLog() {
    defaultLog.length = 0;
}
//# sourceMappingURL=observability.js.map