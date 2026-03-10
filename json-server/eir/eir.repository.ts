import fs from 'fs';
import { buildFallbackEirDocument } from './eir.fallback';
import { parseEirDocxDocument } from './eir.parser';
import { eirDocumentSource } from './eir.source';
import { EIRDocumentResponse } from './types';

interface RepositoryCache {
    cacheKey: string;
    document: EIRDocumentResponse;
}

export class EIRRepository {
    private cache: RepositoryCache | null = null;

    public async getDocument(): Promise<EIRDocumentResponse> {
        const source = eirDocumentSource;

        if (!fs.existsSync(source.filePath)) {
            return buildFallbackEirDocument({
                id: source.id,
                slug: source.slug,
                title: source.title,
                breadcrumbs: source.breadcrumbs,
            });
        }

        const stat = fs.statSync(source.filePath);
        const cacheKey = `${source.filePath}:${stat.mtimeMs}`;

        if (this.cache?.cacheKey === cacheKey) {
            return this.cache.document;
        }

        let document: EIRDocumentResponse;

        try {
            document = await parseEirDocxDocument({
                filePath: source.filePath,
                id: source.id,
                slug: source.slug,
                title: source.title,
                breadcrumbs: source.breadcrumbs,
                updatedAt: stat.mtime.toISOString(),
            });
        } catch {
            document = buildFallbackEirDocument({
                id: source.id,
                slug: source.slug,
                title: source.title,
                breadcrumbs: source.breadcrumbs,
            });
        }

        this.cache = {
            cacheKey,
            document,
        };

        return document;
    }
}
