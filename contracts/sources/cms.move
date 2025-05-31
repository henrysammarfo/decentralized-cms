// contracts/sources/cms.move
module decentralized_cms::cms {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use std::vector;
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};
    use sui::bag::{Self, Bag};

    // =================== Error Codes ===================
    const ENotAuthorized: u64 = 1001;
    const ESiteNotFound: u64 = 1002;
    const EPageNotFound: u64 = 1003;
    const EAlreadyAuthor: u64 = 1004;
    const ENotAuthor: u64 = 1005;
    const EInvalidTemplate: u64 = 1006;
    const EEmptyContent: u64 = 1007;

    // =================== Structs ===================

    /// Admin capability for the entire CMS system
    public struct AdminCap has key, store {
        id: UID,
    }

    /// Site owner capability
    public struct SiteOwnerCap has key, store {
        id: UID,
        site_id: ID,
    }

    /// Main CMS site object
    public struct CMSSite has key, store {
        id: UID,
        name: String,
        description: String,
        owner: address,
        template_id: String,
        authors: vector<address>,
        pages: Table<String, ID>, // page_slug -> page_id
        created_at: u64,
        updated_at: u64,
        is_active: bool,
        walrus_site_id: String, // For Walrus Sites deployment
    }

    /// Individual content page
    public struct ContentPage has key, store {
        id: UID,
        site_id: ID,
        title: String,
        slug: String,
        content_blob_id: String, // Walrus blob ID
        author: address,
        created_at: u64,
        updated_at: u64,
        is_published: bool,
        metadata: Bag, // For additional page metadata
    }

    /// Template for site rendering
    public struct SiteTemplate has key, store {
        id: UID,
        name: String,
        description: String,
        template_blob_id: String, // Walrus blob ID for template files
        css_blob_id: String,      // CSS styles blob ID
        js_blob_id: String,       // JavaScript blob ID (optional)
        author: address,
        is_public: bool,
        created_at: u64,
    }

    /// Global CMS registry
    public struct CMSRegistry has key {
        id: UID,
        total_sites: u64,
        total_pages: u64,
        total_templates: u64,
        site_counter: u64,
        admin: address,
    }

    // =================== Events ===================

    public struct SiteCreated has copy, drop {
        site_id: ID,
        name: String,
        owner: address,
        timestamp: u64,
    }

    public struct PageCreated has copy, drop {
        page_id: ID,
        site_id: ID,
        title: String,
        author: address,
        timestamp: u64,
    }

    public struct PageUpdated has copy, drop {
        page_id: ID,
        site_id: ID,
        author: address,
        timestamp: u64,
    }

    public struct AuthorAdded has copy, drop {
        site_id: ID,
        author: address,
        added_by: address,
        timestamp: u64,
    }

    public struct AuthorRemoved has copy, drop {
        site_id: ID,
        author: address,
        removed_by: address,
        timestamp: u64,
    }

    public struct TemplateCreated has copy, drop {
        template_id: ID,
        name: String,
        author: address,
        timestamp: u64,
    }

    // =================== Init Function ===================

    /// Initialize the CMS module
    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };

        let registry = CMSRegistry {
            id: object::new(ctx),
            total_sites: 0,
            total_pages: 0,
            total_templates: 0,
            site_counter: 0,
            admin: tx_context::sender(ctx),
        };

        // Transfer admin cap to deployer
        transfer::transfer(admin_cap, tx_context::sender(ctx));
        
        // Share the registry
        transfer::share_object(registry);
    }

    // =================== Admin Functions ===================

    /// Transfer admin capability to new admin
    public fun transfer_admin_cap(
        admin_cap: AdminCap,
        new_admin: address,
    ) {
        transfer::transfer(admin_cap, new_admin);
    }

    /// Update registry admin (only by admin cap holder)
    public fun update_registry_admin(
        _admin_cap: &AdminCap,
        registry: &mut CMSRegistry,
        new_admin: address,
    ) {
        registry.admin = new_admin;
    }

    // =================== Site Management Functions ===================

    /// Create a new CMS site
    public fun create_site(
        registry: &mut CMSRegistry,
        name: String,
        description: String,
        template_id: String,
        clock: &Clock,
        ctx: &mut TxContext
    ): (CMSSite, SiteOwnerCap) {
        let site_id = object::new(ctx);
        let site_id_copy = object::uid_to_inner(&site_id);
        let current_time = clock::timestamp_ms(clock);
        let sender = tx_context::sender(ctx);

        let site = CMSSite {
            id: site_id,
            name,
            description,
            owner: sender,
            template_id,
            authors: vector::empty<address>(),
            pages: table::new<String, ID>(ctx),
            created_at: current_time,
            updated_at: current_time,
            is_active: true,
            walrus_site_id: string::utf8(b""), // To be set when deployed
        };

        let owner_cap = SiteOwnerCap {
            id: object::new(ctx),
            site_id: site_id_copy,
        };

        // Update registry
        registry.total_sites = registry.total_sites + 1;
        registry.site_counter = registry.site_counter + 1;

        // Emit event
        event::emit(SiteCreated {
            site_id: site_id_copy,
            name: site.name,
            owner: sender,
            timestamp: current_time,
        });

        (site, owner_cap)
    }

    /// Add author to site (only site owner)
    public fun add_author(
        site: &mut CMSSite,
        _site_owner_cap: &SiteOwnerCap,
        author_address: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(!vector::contains(&site.authors, &author_address), EAlreadyAuthor);
        
        vector::push_back(&mut site.authors, author_address);
        site.updated_at = clock::timestamp_ms(clock);

        event::emit(AuthorAdded {
            site_id: object::uid_to_inner(&site.id),
            author: author_address,
            added_by: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock),
        });
    }

    /// Remove author from site (only site owner)
    public fun remove_author(
        site: &mut CMSSite,
        _site_owner_cap: &SiteOwnerCap,
        author_address: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let (found, index) = vector::index_of(&site.authors, &author_address);
        assert!(found, ENotAuthor);
        
        vector::remove(&mut site.authors, index);
        site.updated_at = clock::timestamp_ms(clock);

        event::emit(AuthorRemoved {
            site_id: object::uid_to_inner(&site.id),
            author: author_address,
            removed_by: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock),
        });
    }

    /// Update site template (only site owner)
    public fun update_site_template(
        site: &mut CMSSite,
        _site_owner_cap: &SiteOwnerCap,
        new_template_id: String,
        clock: &Clock,
    ) {
        site.template_id = new_template_id;
        site.updated_at = clock::timestamp_ms(clock);
    }

    /// Set Walrus site ID after deployment
    public fun set_walrus_site_id(
        site: &mut CMSSite,
        _site_owner_cap: &SiteOwnerCap,
        walrus_site_id: String,
        clock: &Clock,
    ) {
        site.walrus_site_id = walrus_site_id;
        site.updated_at = clock::timestamp_ms(clock);
    }

    // =================== Page Management Functions ===================

    /// Create a new page (only site owner or authorized author)
    public fun create_page(
        registry: &mut CMSRegistry,
        site: &mut CMSSite,
        title: String,
        slug: String,
        content_blob_id: String,
        clock: &Clock,
        ctx: &mut TxContext
    ): ContentPage {
        let sender = tx_context::sender(ctx);
        
        // Check authorization
        assert!(
            sender == site.owner || vector::contains(&site.authors, &sender),
            ENotAuthorized
        );

        // Check if slug already exists
        assert!(!table::contains(&site.pages, slug), EAlreadyAuthor);

        let page_id = object::new(ctx);
        let page_id_copy = object::uid_to_inner(&page_id);
        let current_time = clock::timestamp_ms(clock);

        let page = ContentPage {
            id: page_id,
            site_id: object::uid_to_inner(&site.id),
            title,
            slug,
            content_blob_id,
            author: sender,
            created_at: current_time,
            updated_at: current_time,
            is_published: true,
            metadata: bag::new(ctx),
        };

        // Add to site's page registry
        table::add(&mut site.pages, slug, page_id_copy);
        site.updated_at = current_time;

        // Update global registry
        registry.total_pages = registry.total_pages + 1;

        // Emit event
        event::emit(PageCreated {
            page_id: page_id_copy,
            site_id: object::uid_to_inner(&site.id),
            title: page.title,
            author: sender,
            timestamp: current_time,
        });

        page
    }

    /// Update page content (only site owner or authorized author)
    public fun update_page(
        site: &CMSSite,
        page: &mut ContentPage,
        new_content_blob_id: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Check authorization
        assert!(
            sender == site.owner || vector::contains(&site.authors, &sender),
            ENotAuthorized
        );

        page.content_blob_id = new_content_blob_id;
        page.updated_at = clock::timestamp_ms(clock);

        event::emit(PageUpdated {
            page_id: object::uid_to_inner(&page.id),
            site_id: page.site_id,
            author: sender,
            timestamp: clock::timestamp_ms(clock),
        });
    }

    /// Update page title and slug (only site owner or authorized author)
    public fun update_page_metadata(
        site: &mut CMSSite,
        page: &mut ContentPage,
        new_title: String,
        new_slug: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Check authorization
        assert!(
            sender == site.owner || vector::contains(&site.authors, &sender),
            ENotAuthorized
        );

        // Remove old slug and add new one
        table::remove(&mut site.pages, page.slug);
        table::add(&mut site.pages, new_slug, object::uid_to_inner(&page.id));

        page.title = new_title;
        page.slug = new_slug;
        page.updated_at = clock::timestamp_ms(clock);
    }

    /// Toggle page published status
    public fun toggle_page_published(
        site: &CMSSite,
        page: &mut ContentPage,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Check authorization
        assert!(
            sender == site.owner || vector::contains(&site.authors, &sender),
            ENotAuthorized
        );

        page.is_published = !page.is_published;
        page.updated_at = clock::timestamp_ms(clock);
    }

    // =================== Template Management Functions ===================

    /// Create a new site template
    public fun create_template(
        registry: &mut CMSRegistry,
        name: String,
        description: String,
        template_blob_id: String,
        css_blob_id: String,
        js_blob_id: String,
        is_public: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ): SiteTemplate {
        let template_id = object::new(ctx);
        let template_id_copy = object::uid_to_inner(&template_id);
        let current_time = clock::timestamp_ms(clock);
        let sender = tx_context::sender(ctx);

        let template = SiteTemplate {
            id: template_id,
            name,
            description,
            template_blob_id,
            css_blob_id,
            js_blob_id,
            author: sender,
            is_public,
            created_at: current_time,
        };

        // Update registry
        registry.total_templates = registry.total_templates + 1;

        // Emit event
        event::emit(TemplateCreated {
            template_id: template_id_copy,
            name: template.name,
            author: sender,
            timestamp: current_time,
        });

        template
    }

    // =================== View Functions ===================

    /// Check if address is authorized for site
    public fun is_authorized(site: &CMSSite, author: address): bool {
        author == site.owner || vector::contains(&site.authors, &author)
    }

    /// Get site info
    public fun get_site_info(site: &CMSSite): (String, String, address, String, u64, u64, bool) {
        (
            site.name,
            site.description, 
            site.owner,
            site.template_id,
            site.created_at,
            site.updated_at,
            site.is_active
        )
    }

    /// Get page info
    public fun get_page_info(page: &ContentPage): (String, String, String, address, u64, u64, bool) {
        (
            page.title,
            page.slug,
            page.content_blob_id,
            page.author,
            page.created_at,
            page.updated_at,
            page.is_published
        )
    }

    /// Get template info
    public fun get_template_info(template: &SiteTemplate): (String, String, String, String, String, address, bool) {
        (
            template.name,
            template.description,
            template.template_blob_id,
            template.css_blob_id,
            template.js_blob_id,
            template.author,
            template.is_public
        )
    }

    /// Get registry stats
    public fun get_registry_stats(registry: &CMSRegistry): (u64, u64, u64, address) {
        (
            registry.total_sites,
            registry.total_pages,
            registry.total_templates,
            registry.admin
        )
    }

    // =================== Helper Functions ===================

    /// Get site authors list
    public fun get_site_authors(site: &CMSSite): vector<address> {
        site.authors
    }

    /// Get number of pages in site
    public fun get_page_count(site: &CMSSite): u64 {
        table::length(&site.pages)
    }
    
    /// Suspend/unsuspend site (admin only)
    public fun toggle_site_suspension(
        _admin_cap: &AdminCap,
        site: &mut CMSSite,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        site.is_active = !site.is_active;
        site.updated_at = clock::timestamp_ms(clock);

        event::emit(SiteSuspended {
            site_id: object::uid_to_inner(&site.id),
            is_active: site.is_active,
            admin: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock),
        });
    }

    /// Force update site content (admin emergency override)
    public fun admin_emergency_update_site(
        _admin_cap: &AdminCap,
        site: &mut CMSSite,
        new_name: String,
        new_description: String,
        reason: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        site.name = new_name;
        site.description = new_description;
        site.updated_at = clock::timestamp_ms(clock);

        event::emit(AdminEmergencyUpdate {
            site_id: object::uid_to_inner(&site.id),
            admin: tx_context::sender(ctx),
            reason,
            timestamp: clock::timestamp_ms(clock),
        });
    }
}