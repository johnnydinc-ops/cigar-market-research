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
/**
 * Default observability implementation: logs to console and optional in-memory buffer.
 */
export declare function createObservability(buffer?: LogEvent[]): IngestionObservability;
export declare function getLog(): LogEvent[];
export declare function clearLog(): void;
//# sourceMappingURL=observability.d.ts.map