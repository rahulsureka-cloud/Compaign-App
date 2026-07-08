namespace MarketingApi.Models;

/// <summary>
/// A marketing campaign. Field shapes must stay in sync with CLAUDE.md §6,
/// the React components, and src/data/campaigns.json.
/// </summary>
public class Campaign
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    /// <summary>Email | SMS | Push | Web</summary>
    public string Channel { get; set; } = "Email";

    /// <summary>Draft | Active | Paused | Completed</summary>
    public string Status { get; set; } = "Draft";

    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;

    /// <summary>Total targeted population.</summary>
    public int TargetedPopulation { get; set; }

    /// <summary>Accepted / fulfilled.</summary>
    public int Accepted { get; set; }

    /// <summary>Declined.</summary>
    public int Declined { get; set; }

    /// <summary>Clicked but did not finish.</summary>
    public int ClickedUnfinished { get; set; }
}
