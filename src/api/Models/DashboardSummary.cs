namespace MarketingApi.Models;

/// <summary>Aggregated metrics for the Campaign &amp; Promotion Dashboard.</summary>
public class DashboardSummary
{
    public int TotalCampaigns { get; set; }
    public int ActiveCampaigns { get; set; }
    public int TotalTargetedPopulation { get; set; }
    public int TotalAccepted { get; set; }
    public int TotalDeclined { get; set; }
    public int TotalClickedUnfinished { get; set; }

    /// <summary>Per-campaign decision breakdown for charts/tables.</summary>
    public List<CampaignPerformance> Campaigns { get; set; } = new();
}

public class CampaignPerformance
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int TargetedPopulation { get; set; }
    public int Accepted { get; set; }
    public int Declined { get; set; }
    public int ClickedUnfinished { get; set; }
}
