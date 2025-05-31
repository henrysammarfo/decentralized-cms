/* eslint-disable @typescript-eslint/no-unused-vars */
// frontend/src/sdk/cms-sdk.ts
import { 
    SuiClient, 
    type SuiTransactionBlockResponse,
    type SuiObjectResponse,
    type PaginatedObjectsResponse 
} from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { isValidSuiAddress, normalizeStructTag } from '@mysten/sui/utils';
// =================== Types ===================

export interface CMSConfig {
    rpcUrl: string;
    packageId: string;
    adminCapId?: string;
    registryId: string;
}

export interface SiteInfo {
    id: string;
    name: string;
    description: string;
    owner: string;
    templateId: string;
    authors: string[];
    createdAt: number;
    updatedAt: number;
    isActive: boolean;
    walrusSiteId: string;
    pageCount: number;
}

export interface PageInfo {
    id: string;
    siteId: string;
    title: string;
    slug: string;
    contentBlobId: string;
    author: string;
    createdAt: number;
    updatedAt: number;
    isPublished: boolean;
}

export interface TemplateInfo {
    id: string;
    name: string;
    description: string;
    templateBlobId: string;
    cssBlobId: string;
    jsBlobId: string;
    author: string;
    isPublic: boolean;
    createdAt: number;
}

export interface CMSStats {
    totalSites: number;
    totalPages: number;
    totalTemplates: number;
    admin: string;
}

// =================== Events ===================

export interface SiteCreatedEvent {
    siteId: string;
    name: string;
    owner: string;
    timestamp: number;
}

export interface PageCreatedEvent {
    pageId: string;
    siteId: string;
    title: string;
    author: string;
    timestamp: number;
}

export interface AuthorAddedEvent {
    siteId: string;
    author: string;
    addedBy: string;
    timestamp: number;
}

// =================== Error Types ===================

export class CMSError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'CMSError';
    }
}

export class ValidationError extends CMSError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}

export class AuthorizationError extends CMSError {
    constructor(message: string) {
        super(message, 'AUTHORIZATION_ERROR');
        this.name = 'AuthorizationError';
    }
}

// =================== Main SDK Class ===================

export class DecentralizedCMSSDK {
    private client: SuiClient;
    private config: CMSConfig;

    constructor(config: CMSConfig) {
        this.validateConfig(config);
        this.config = config;
        this.client = new SuiClient({ url: config.rpcUrl });
    }

    private validateConfig(config: CMSConfig): void {
        if (!config.rpcUrl) {
            throw new ValidationError('RPC URL is required');
        }
        if (!config.packageId || !isValidSuiAddress(config.packageId)) {
            throw new ValidationError('Valid package ID is required');
        }
        if (!config.registryId || !isValidSuiAddress(config.registryId)) {
            throw new ValidationError('Valid registry ID is required');
        }
        if (config.adminCapId && !isValidSuiAddress(config.adminCapId)) {
            throw new ValidationError('Admin capability ID must be a valid Sui address');
        }
    }

    // =================== Site Management ===================

    /**
     * Create a new CMS site
     */
    async createSite(
        signerAddress: string,
        name: string,
        description: string,
        templateId: string = "default"
    ): Promise<Transaction> {
        // Validate inputs
        const nameValidation = this.validateSiteName(name);
        if (!nameValidation.isValid) {
            throw new ValidationError(nameValidation.error!);
        }

        if (!isValidSuiAddress(signerAddress)) {
            throw new ValidationError('Invalid signer address');
        }

        const tx = new Transaction();
        
        // Create site and owner capability
        const [site, ownerCap] = tx.moveCall({
            target: `${this.config.packageId}::cms::create_site`,
            arguments: [
                tx.object(this.config.registryId),
                tx.pure.string(name),
                tx.pure.string(description),
                tx.pure.string(templateId),
                tx.object('0x6'), // Clock object
            ],
        });

        // Transfer objects to sender
        tx.transferObjects([site, ownerCap], signerAddress);

        return tx;
    }

    /**
     * Add author to site
     */
    async addAuthor(
        siteId: string,
        ownerCapId: string,
        authorAddress: string
    ): Promise<Transaction> {
        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }
        if (!isValidSuiAddress(ownerCapId)) {
            throw new ValidationError('Invalid owner capability ID');
        }
        if (!isValidSuiAddress(authorAddress)) {
            throw new ValidationError('Invalid author address');
        }

        const tx = new Transaction();

        tx.moveCall({
            target: `${this.config.packageId}::cms::add_author`,
            arguments: [
                tx.object(siteId),
                tx.object(ownerCapId),
                tx.pure.address(authorAddress),
                tx.object('0x6'), // Clock object
            ],
        });

        return tx;
    }

    /**
     * Remove author from site
     */
    async removeAuthor(
        siteId: string,
        ownerCapId: string,
        authorAddress: string
    ): Promise<Transaction> {
        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }
        if (!isValidSuiAddress(ownerCapId)) {
            throw new ValidationError('Invalid owner capability ID');
        }
        if (!isValidSuiAddress(authorAddress)) {
            throw new ValidationError('Invalid author address');
        }

        const tx = new Transaction();

        tx.moveCall({
            target: `${this.config.packageId}::cms::remove_author`,
            arguments: [
                tx.object(siteId),
                tx.object(ownerCapId),
                tx.pure.address(authorAddress),
                tx.object('0x6'), // Clock object
            ],
        });

        return tx;
    }

    /**
     * Update site template
     */
    async updateSiteTemplate(
        siteId: string,
        ownerCapId: string,
        newTemplateId: string
    ): Promise<Transaction> {
        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }
        if (!isValidSuiAddress(ownerCapId)) {
            throw new ValidationError('Invalid owner capability ID');
        }

        const tx = new Transaction();

        tx.moveCall({
            target: `${this.config.packageId}::cms::update_site_template`,
            arguments: [
                tx.object(siteId),
                tx.object(ownerCapId),
                tx.pure.string(newTemplateId),
                tx.object('0x6'), // Clock object
            ],
        });

        return tx;
    }

    /**
     * Set Walrus site ID after deployment
     */
    async setWalrusSiteId(
        siteId: string,
        ownerCapId: string,
        walrusSiteId: string
    ): Promise<Transaction> {
        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }
        if (!isValidSuiAddress(ownerCapId)) {
            throw new ValidationError('Invalid owner capability ID');
        }

        const tx = new Transaction();

        tx.moveCall({
            target: `${this.config.packageId}::cms::set_walrus_site_id`,
            arguments: [
                tx.object(siteId),
                tx.object(ownerCapId),
                tx.pure.string(walrusSiteId),
                tx.object('0x6'), // Clock object
            ],
        });

        return tx;
    }

    // =================== Page Management ===================

    /**
     * Create a new page
     */
    async createPage(
        signerAddress: string,
        siteId: string,
        title: string,
        slug: string,
        contentBlobId: string
    ): Promise<Transaction> {
        // Validate inputs
        const slugValidation = this.validateSlug(slug);
        if (!slugValidation.isValid) {
            throw new ValidationError(slugValidation.error!);
        }

        if (!isValidSuiAddress(signerAddress)) {
            throw new ValidationError('Invalid signer address');
        }
        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }

        const tx = new Transaction();

        const page = tx.moveCall({
            target: `${this.config.packageId}::cms::create_page`,
            arguments: [
                tx.object(this.config.registryId),
                tx.object(siteId),
                tx.pure.string(title),
                tx.pure.string(slug),
                tx.pure.string(contentBlobId),
                tx.object('0x6'), // Clock object
            ],
        });

        // Transfer page to sender
        tx.transferObjects([page], signerAddress);

        return tx;
    }

    /**
     * Update page content
     */
    async updatePage(
        siteId: string,
        pageId: string,
        newContentBlobId: string
    ): Promise<Transaction> {
        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }
        if (!isValidSuiAddress(pageId)) {
            throw new ValidationError('Invalid page ID');
        }

        const tx = new Transaction();

        tx.moveCall({
            target: `${this.config.packageId}::cms::update_page`,
            arguments: [
                tx.object(siteId),
                tx.object(pageId),
                tx.pure.string(newContentBlobId),
                tx.object('0x6'), // Clock object
            ],
        });

        return tx;
    }

    /**
     * Update page metadata (title and slug)
     */
    async updatePageMetadata(
        siteId: string,
        pageId: string,
        newTitle: string,
        newSlug: string
    ): Promise<Transaction> {
        const slugValidation = this.validateSlug(newSlug);
        if (!slugValidation.isValid) {
            throw new ValidationError(slugValidation.error!);
        }

        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }
        if (!isValidSuiAddress(pageId)) {
            throw new ValidationError('Invalid page ID');
        }

        const tx = new Transaction();

        tx.moveCall({
            target: `${this.config.packageI}::cms::update_page_metadata`,
            arguments: [
                tx.object(siteId),
                tx.object(pageId),
                tx.pure.string(newTitle),
                tx.pure.string(newSlug),
                tx.object('0x6'), // Clock object
            ],
        });

        return tx;
    }

    /**
     * Toggle page published status
     */
    async togglePagePublished(
        siteId: string,
        pageId: string
    ): Promise<Transaction> {
        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }
        if (!isValidSuiAddress(pageId)) {
            throw new ValidationError('Invalid page ID');
        }

        const tx = new Transaction();

        tx.moveCall({
            target: `${this.config.packageId}::cms::toggle_page_published`,
            arguments: [
                tx.object(siteId),
                tx.object(pageId),
                tx.object('0x6'), // Clock object
            ],
        });

        return tx;
    }

    // =================== Template Management ===================

    /**
     * Create a new template
     */
    async createTemplate(
        signerAddress: string,
        name: string,
        description: string,
        templateBlobId: string,
        cssBlobId: string,
        jsBlobId: string = "",
        isPublic: boolean = true
    ): Promise<Transaction> {
        if (!isValidSuiAddress(signerAddress)) {
            throw new ValidationError('Invalid signer address');
        }

        const tx = new Transaction();

        const template = tx.moveCall({
            target: `${this.config.packageId}::cms::create_template`,
            arguments: [
                tx.object(this.config.registryId),
                tx.pure.string(name),
                tx.pure.string(description),
                tx.pure.string(templateBlobId),
                tx.pure.string(cssBlobId),
                tx.pure.string(jsBlobId),
                tx.pure.bool(isPublic),
                tx.object('0x6'), // Clock object
            ],
        });

        tx.transferObjects([template], signerAddress);

        return tx;
    }

    // =================== Admin Functions ===================

    /**
     * Toggle site suspension (admin only)
     */
    async toggleSiteSuspension(siteId: string): Promise<Transaction> {
        if (!this.config.adminCapId) {
            throw new AuthorizationError('Admin capability ID not configured');
        }

        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }

        const tx = new Transaction();

        tx.moveCall({
            target: `${this.config.packageId}::cms::toggle_site_suspension`,
            arguments: [
                tx.object(this.config.adminCapId),
                tx.object(siteId),
                tx.object('0x6'), // Clock object
            ],
        });

        return tx;
    }

    /**
     * Admin emergency update (admin only)
     */
    async adminEmergencyUpdate(
        siteId: string,
        newName: string,
        newDescription: string,
        reason: string
    ): Promise<Transaction> {
        if (!this.config.adminCapId) {
            throw new AuthorizationError('Admin capability ID not configured');
        }

        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }

        const tx = new Transaction();

        tx.moveCall({
            target: `${this.config.packageId}::cms::admin_emergency_update_site`,
            arguments: [
                tx.object(this.config.adminCapId),
                tx.object(siteId),
                tx.pure.string(newName),
                tx.pure.string(newDescription),
                tx.pure.string(reason),
                tx.object('0x6'), // Clock object
            ],
        });

        return tx;
    }

    // =================== Query Functions ===================

    /**
     * Get site information
     */
    async getSiteInfo(siteId: string): Promise<SiteInfo | null> {
        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }

        try {
            const response = await this.client.getObject({
                id: siteId,
                options: {
                    showContent: true,
                    showType: true,
                },
            });

            if (!response.data?.content || response.data.content.dataType !== 'moveObject') {
                return null;
            }

            const fields = response.data.content.fields as any;
            
            return {
                id: siteId,
                name: fields.name,
                description: fields.description,
                owner: fields.owner,
                templateId: fields.template_id,
                authors: fields.authors || [],
                createdAt: parseInt(fields.created_at),
                updatedAt: parseInt(fields.updated_at),
                isActive: fields.is_active,
                walrusSiteId: fields.walrus_site_id || '',
                pageCount: fields.pages?.fields?.size || 0,
            };
        } catch (error) {
            console.error('Error fetching site info:', error);
            throw new CMSError(`Failed to fetch site info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get page information
     */
    async getPageInfo(pageId: string): Promise<PageInfo | null> {
        if (!isValidSuiAddress(pageId)) {
            throw new ValidationError('Invalid page ID');
        }

        try {
            const response = await this.client.getObject({
                id: pageId,
                options: {
                    showContent: true,
                    showType: true,
                },
            });

            if (!response.data?.content || response.data.content.dataType !== 'moveObject') {
                return null;
            }

            const fields = response.data.content.fields as any;
            
            return {
                id: pageId,
                siteId: fields.site_id,
                title: fields.title,
                slug: fields.slug,
                contentBlobId: fields.content_blob_id,
                author: fields.author,
                createdAt: parseInt(fields.created_at),
                updatedAt: parseInt(fields.updated_at),
                isPublished: fields.is_published,
            };
        } catch (error) {
            console.error('Error fetching page info:', error);
            throw new CMSError(`Failed to fetch page info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get template information
     */
    async getTemplateInfo(templateId: string): Promise<TemplateInfo | null> {
        if (!isValidSuiAddress(templateId)) {
            throw new ValidationError('Invalid template ID');
        }

        try {
            const response = await this.client.getObject({
                id: templateId,
                options: {
                    showContent: true,
                    showType: true,
                },
            });

            if (!response.data?.content || response.data.content.dataType !== 'moveObject') {
                return null;
            }

            const fields = response.data.content.fields as any;
            
            return {
                id: templateId,
                name: fields.name,
                description: fields.description,
                templateBlobId: fields.template_blob_id,
                cssBlobId: fields.css_blob_id,
                jsBlobId: fields.js_blob_id || '',
                author: fields.author,
                isPublic: fields.is_public,
                createdAt: parseInt(fields.created_at),
            };
        } catch (error) {
            console.error('Error fetching template info:', error);
            throw new CMSError(`Failed to fetch template info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get CMS registry statistics
     */
    async getCMSStats(): Promise<CMSStats | null> {
        try {
            const response = await this.client.getObject({
                id: this.config.registryId,
                options: {
                    showContent: true,
                    showType: true,
                },
            });

            if (!response.data?.content || response.data.content.dataType !== 'moveObject') {
                return null;
            }

            const fields = response.data.content.fields as any;
            
            return {
                totalSites: parseInt(fields.total_sites),
                totalPages: parseInt(fields.total_pages),
                totalTemplates: parseInt(fields.total_templates),
                admin: fields.admin,
            };
        } catch (error) {
            console.error('Error fetching CMS stats:', error);
            throw new CMSError(`Failed to fetch CMS stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get all sites owned by an address
     */
    async getUserSites(ownerAddress: string): Promise<SiteInfo[]> {
        if (!isValidSuiAddress(ownerAddress)) {
            throw new ValidationError('Invalid owner address');
        }

        try {
            const response = await this.client.getOwnedObjects({
                owner: ownerAddress,
                filter: {
                    StructType: `${this.config.packageId}::cms::CMSSite`
                },
                options: {
                    showContent: true,
                    showType: true,
                },
            });

            const sites: SiteInfo[] = [];
            
            for (const obj of response.data) {
                if (obj.data?.content && obj.data.content.dataType === 'moveObject') {
                    const fields = obj.data.content.fields as any;
                    sites.push({
                        id: obj.data.objectId,
                        name: fields.name,
                        description: fields.description,
                        owner: fields.owner,
                        templateId: fields.template_id,
                        authors: fields.authors || [],
                        createdAt: parseInt(fields.created_at),
                        updatedAt: parseInt(fields.updated_at),
                        isActive: fields.is_active,
                        walrusSiteId: fields.walrus_site_id || '',
                        pageCount: fields.pages?.fields?.size || 0,
                    });
                }
            }

            return sites;
        } catch (error) {
            console.error('Error fetching user sites:', error);
            throw new CMSError(`Failed to fetch user sites: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get all pages for a site (requires indexing or event parsing)
     */
    async getSitePages(siteId: string): Promise<PageInfo[]> {
        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }

        try {
            // Query events to find pages created for this site
            const events = await this.client.queryEvents({
                query: {
                    MoveEventType: `${this.config.packageId}::cms::PageCreated`
                },
                limit: 1000,
                order: 'descending'
            });

            const pages: PageInfo[] = [];
            
            for (const event of events.data) {
                if (event.parsedJson && (event.parsedJson as any).site_id === siteId) {
                    const pageId = (event.parsedJson as any).page_id;
                    const pageInfo = await this.getPageInfo(pageId);
                    if (pageInfo) {
                        pages.push(pageInfo);
                    }
                }
            }

            return pages;
        } catch (error) {
            console.error('Error fetching site pages:', error);
            return [];
        }
    }

    /**
     * Check if address is authorized for site operations
     */
    async isAuthorized(siteId: string, address: string): Promise<boolean> {
        if (!isValidSuiAddress(siteId) || !isValidSuiAddress(address)) {
            return false;
        }

        const siteInfo = await this.getSiteInfo(siteId);
        if (!siteInfo) return false;
        
        return siteInfo.owner === address || siteInfo.authors.includes(address);
    }

    // =================== Event Functions ===================

    /**
     * Get recent events for a site
     */
    async getSiteEvents(siteId: string, limit: number = 50): Promise<any[]> {
        if (!isValidSuiAddress(siteId)) {
            throw new ValidationError('Invalid site ID');
        }

        try {
            const events = await this.client.queryEvents({
                query: {
                    MoveEventType: `${this.config.packageId}::cms::SiteCreated`
                },
                limit,
                order: 'descending'
            });

            return events.data.filter(event => 
                event.parsedJson && (event.parsedJson as any).site_id === siteId
            );
        } catch (error) {
            console.error('Error fetching site events:', error);
            return [];
        }
    }

    // =================== Transaction Execution Helper ===================

    /**
     * Execute a transaction with proper error handling
     */
    async executeTransaction(
        tx: Transaction, 
        signer: any // Accept any signer (wallet adapter, keypair, etc.)
    ): Promise<SuiTransactionBlockResponse> {
        try {
            const result = await this.client.signAndExecuteTransaction({
                signer,
                transaction: tx,
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                    showEvents: true,
                },
            });

            if (result.effects?.status?.status !== 'success') {
                throw new CMSError(`Transaction failed: ${result.effects?.status?.error || 'Unknown error'}`);
            }

            return result;
        } catch (error) {
            console.error('Transaction execution failed:', error);
            throw new CMSError(`Transaction execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // =================== Utility Functions ===================

    /**
     * Validate site name
     */
    validateSiteName(name: string): { isValid: boolean; error?: string } {
        if (!name || name.trim().length === 0) {
            return { isValid: false, error: 'Site name cannot be empty' };
        }
        if (name.length > 100) {
            return { isValid: false, error: 'Site name must be less than 100 characters' };
        }
        if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
            return { isValid: false, error: 'Site name contains invalid characters' };
        }
        return { isValid: true };
    }

    /**
     * Validate page slug
     */
    validateSlug(slug: string): { isValid: boolean; error?: string } {
        if (!slug || slug.trim().length === 0) {
            return { isValid: false, error: 'Slug cannot be empty' };
        }
        if (slug.length > 50) {
            return { isValid: false, error: 'Slug must be less than 50 characters' };
        }
        if (!/^[a-z0-9\-]+$/.test(slug)) {
            return { isValid: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens' };
        }
        return { isValid: true };
    }

    /**
     * Generate slug from title
     */
    generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s\-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);
    }

    /**
     * Get client instance for advanced operations
     */
    getClient(): SuiClient {
        return this.client;
    }

    /**
     * Get configuration
     */
    getConfig(): CMSConfig {
        return { ...this.config };
    }
}

// =================== Factory Functions ===================

/**
 * Create SDK instance with default testnet configuration
 */
export function createTestnetSDK(packageId: string, registryId: string, adminCapId?: string): DecentralizedCMSSDK {
    return new DecentralizedCMSSDK({
        rpcUrl: 'https://fullnode.testnet.sui.io:443',
        packageId,
        registryId,
        adminCapId,
    });
}

/**
 * Create SDK instance with default mainnet configuration
 */
export function createMainnetSDK(packageId: string, registryId: string, adminCapId?: string): DecentralizedCMSSDK {
    return new DecentralizedCMSSDK({
        rpcUrl: 'https://fullnode.mainnet.sui.io:443',
        packageId,
        registryId,
        adminCapId,
    });
}

/**
 * Create SDK instance with default devnet configuration
 */
export function createDevnetSDK(packageId: string, registryId: string, adminCapId?: string): DecentralizedCMSSDK {
    return new DecentralizedCMSSDK({
        rpcUrl: 'https://fullnode.devnet.sui.io:443',
        packageId,
        registryId,
        adminCapId,
    });
}

/**
 * Create SDK instance with custom configuration
 */
export function createCustomSDK(config: CMSConfig): DecentralizedCMSSDK {
    return new DecentralizedCMSSDK(config);
}

// =================== Export Types ===================

export type {
    CMSConfig,
    SiteInfo,
    PageInfo,
    TemplateInfo,
    CMSStats,
    SiteCreatedEvent,
    PageCreatedEvent,
    AuthorAddedEvent,
};