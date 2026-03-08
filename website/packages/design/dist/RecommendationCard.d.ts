import type { ProvenanceRef } from "@cigar/core";
export interface RecommendationCardProps {
    title: string;
    explanation?: string;
    provenance?: ProvenanceRef[];
    bestPrice?: {
        amountCents: number;
        retailerName: string;
    };
    fromPrice?: number;
    retailerCount?: number;
    ctaLabel?: string;
    onCtaClick?: () => void;
    ctaHref?: string;
    attributes?: {
        strength?: string;
        body?: string;
        wrapper?: string;
    };
    imageUrl?: string;
}
export declare function RecommendationCard({ title, explanation, provenance, bestPrice, fromPrice, retailerCount, ctaLabel, onCtaClick, ctaHref, attributes, imageUrl, }: RecommendationCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=RecommendationCard.d.ts.map