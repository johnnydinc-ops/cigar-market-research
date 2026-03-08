/**
 * Simple observability for ingestion: log events (no PII).
 * Can be replaced with metrics/OTEL later.
 */

import type { IngestionObservability } from "./connectors/types.js";

export interface LogEvent {
  at: string;
  connectorId: string;
  event: "start" | "item" | "warning" | "error" | "end";
  kind?: string;
  count?: number;
  message?: string;
  durationMs?: number;
  totalItems?: number;
}

/** In-memory log sink for tests or simple debugging. */
const defaultLog: LogEvent[] = [];

function emit(ev: Omit<LogEvent, "at">): void {
  const entry: LogEvent = { ...ev, at: new Date().toISOString() };
  defaultLog.push(entry);
  if (process.env.NODE_ENV !== "test") {
    console.log("[ingestion]", JSON.stringify(entry));
  }
}

/**
 * Default observability implementation: logs to console and optional in-memory buffer.
 */
export function createObservability(buffer?: LogEvent[]): IngestionObservability {
  const log = buffer ?? defaultLog;
  return {
    onStart(connectorId) {
      const ev = { connectorId, event: "start" as const };
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

export function getLog(): LogEvent[] {
  return [...defaultLog];
}

export function clearLog(): void {
  defaultLog.length = 0;
}
