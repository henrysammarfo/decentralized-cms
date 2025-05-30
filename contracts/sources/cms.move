// contracts/sources/cms.move
module decentralized_cms::cms {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use std::vector;
    use sui::event;

    // Error codes
    const ENotAuthorized: u64 = 1;
    const EPageNotFound: u64 = 2;
    const EInvalidBlobId: u64 = 3;

    // Main CMS Registry - stores all sites
    struct CMSRegistry has key {
        id: UID,
        sites: vector<ID>,
    }

    // Individual CMS Site
    struct CMSSite has key, store {
        id: UID,
        name: String,
        owner: address,
        admins: vector<address>,
        editors: vector<address>,
        pages: vector<ID>,
        created_at: u64,
    }

    // Individual Content Page
    struct ContentPage has key, store {
        id: UID,
        site_id: ID,
        slug: String,
        title: String,
        blob_id: String, // Walrus blob ID
        author: address,
        created_at: u64,
        updated_at: u64,
        version: u64,
    }

    // Page Update Event
    struct PageUpdated has copy, drop {
        page_id: ID,
        site_id: ID,
        slug: String,
        blob_id: String,
        author: address,
        version: u64,
    }

    // Site Created Event
    struct SiteCreated has copy, drop {
        site_id: ID,
        name: String,
        owner: address,
    }

    // Initialize the CMS Registry (called once)
    fun init(ctx: &mut TxContext) {
        let registry = CMSRegistry {
            id: object::new(ctx),
            sites: vector::empty(),
        };
        transfer::share_object(registry);
    }

    // Create a new CMS site
    public entry fun create_site(
        registry: &mut CMSRegistry,
        name: String,
        ctx: &mut TxContext
    ) {
        let site = CMSSite {
            id: object::new(ctx),
            name,
            owner: tx_context::sender(ctx),
            admins: vector::singleton(tx_context::sender(ctx)),
            editors: vector::empty(),
            pages: vector::empty(),
            created_at: tx_context::epoch(ctx),
        };

        let site_id = object::id(&site);
        vector::push_back(&mut registry.sites, site_id);

        event::emit(SiteCreated {
            site_id,
            name,
            owner: tx_context::sender(ctx),
        });

        transfer::share_object(site);
    }

    // Add editor to site
    public entry fun add_editor(
        site: &mut CMSSite,
        editor: address,
        ctx: &mut TxContext
    ) {
        assert!(is_admin(site, tx_context::sender(ctx)), ENotAuthorized);
        vector::push_back(&mut site.editors, editor);
    }

    // Create or update a content page
    public entry fun update_page(
        site: &mut CMSSite,
        slug: String,
        title: String,
        blob_id: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(can_edit(site, sender), ENotAuthorized);
        assert!(!string::is_empty(&blob_id), EInvalidBlobId);

        // Check if page exists
        let page_exists = false;
        let page_index = 0;
        let i = 0;
        
        // Find existing page by slug (simplified for demo)
        // In production, you'd want a more efficient lookup
        
        let page = ContentPage {
            id: object::new(ctx),
            site_id: object::id(site),
            slug,
            title,
            blob_id,
            author: sender,
            created_at: tx_context::epoch(ctx),
            updated_at: tx_context::epoch(ctx),
            version: 1,
        };

        let page_id = object::id(&page);
        vector::push_back(&mut site.pages, page_id);

        event::emit(PageUpdated {
            page_id,
            site_id: object::id(site),
            slug: page.slug,
            blob_id: page.blob_id,
            author: sender,
            version: page.version,
        });

        transfer::share_object(page);
    }

    // Helper function to check if user is admin
    fun is_admin(site: &CMSSite, user: address): bool {
        site.owner == user || vector::contains(&site.admins, &user)
    }

    // Helper function to check if user can edit
    fun can_edit(site: &CMSSite, user: address): bool {
        is_admin(site, user) || vector::contains(&site.editors, &user)
    }

    // Getter functions
    public fun get_site_name(site: &CMSSite): String {
        site.name
    }

    public fun get_site_owner(site: &CMSSite): address {
        site.owner
    }

    public fun get_page_blob_id(page: &ContentPage): String {
        page.blob_id
    }

    public fun get_page_title(page: &ContentPage): String {
        page.title
    }

    public fun get_page_slug(page: &ContentPage): String {
        page.slug
    }
}