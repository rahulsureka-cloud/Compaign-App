namespace MarketingApi.Models;

/// <summary>
/// A marketing asset attached to a campaign (Content step). One of Image / Text
/// / HTML — only the relevant fields are populated.
/// </summary>
public class CampaignAsset
{
    /// <summary>Image | Text | HTML</summary>
    public string Type { get; set; } = "Image";

    public string? FileName { get; set; }   // Image/HTML upload name
    public string? TagOption { get; set; }   // Image tag option
    public string? AltText { get; set; }     // Image alt text
    public string? CtaLink { get; set; }     // optional CTA link
    public string? Text { get; set; }        // Text asset body
    public string? Html { get; set; }        // HTML asset body
}

/// <summary>
/// A marketing campaign. Field shapes must stay in sync with CLAUDE.md §6,
/// the React components, and src/data/campaigns.json.
/// </summary>
public class Campaign
{
    public string Id { get; set; } = string.Empty;

    // --- Step 1: Setup ---
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Keywords { get; set; }
    public string? ProductCategory { get; set; }

    /// <summary>High | Medium | Low</summary>
    public string? Priority { get; set; }

    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;

    /// <summary>Delivery channels: In-app | Email | SMS | Social media | Ads</summary>
    public List<string> Channels { get; set; } = new();

    // --- Step 2: Content ---
    public List<CampaignAsset> Assets { get; set; } = new();

    // --- Step 3: Segment ---
    public List<string> SegmentIds { get; set; } = new();
    public string? ManualUploadName { get; set; }

    /// <summary>Estimated reach shown in the Audience summary.</summary>
    public int EstimatedReach { get; set; }

    // --- Step 4: Location ---
    public List<string> WebLocations { get; set; } = new();
    public List<string> MobileLocations { get; set; } = new();

    /// <summary>Draft | In-progress | Under approval | Active | Completed</summary>
    public string Status { get; set; } = "Draft";

    // --- Dashboard metrics ---
    public int TargetedPopulation { get; set; }
    public int Accepted { get; set; }
    public int Declined { get; set; }
    public int ClickedUnfinished { get; set; }
}
