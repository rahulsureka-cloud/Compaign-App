using MarketingApi.Data;
using MarketingApi.Models;

namespace MarketingApi.Services;

public interface ICampaignService
{
    IEnumerable<Campaign> GetAll(string? status = null);
    Campaign? GetById(string id);
    Campaign Create(Campaign campaign);
    Campaign? Update(string id, Campaign campaign);
    bool Delete(string id);
    TransitionResult Approve(string id);
    TransitionResult Reject(string id);
    Campaign? Clone(string id);
    DashboardSummary GetDashboard();
}

/// <summary>Outcome of an approval-workflow status transition (see GR-003).</summary>
public enum TransitionOutcome { Success, NotFound, InvalidTransition }

public sealed record TransitionResult(TransitionOutcome Outcome, Campaign? Campaign);

/// <summary>Thread-safe in-memory campaign store for the POC.</summary>
public class CampaignService : ICampaignService
{
    private readonly List<Campaign> _campaigns;
    private readonly object _lock = new();
    private readonly Random _rng = new();

    public CampaignService()
    {
        _campaigns = SeedData.Campaigns();
    }

    public IEnumerable<Campaign> GetAll(string? status = null)
    {
        lock (_lock)
        {
            var query = _campaigns.AsEnumerable();
            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(c => string.Equals(c.Status, status, StringComparison.OrdinalIgnoreCase));
            return query.ToList();
        }
    }

    public Campaign? GetById(string id)
    {
        lock (_lock) { return _campaigns.FirstOrDefault(c => c.Id == id); }
    }

    public Campaign Create(Campaign campaign)
    {
        lock (_lock)
        {
            campaign.Id = Guid.NewGuid().ToString();
            if (string.IsNullOrWhiteSpace(campaign.Status))
                campaign.Status = "Draft";
            EnsureMetrics(campaign);
            _campaigns.Add(campaign);
            return campaign;
        }
    }

    public Campaign? Update(string id, Campaign campaign)
    {
        lock (_lock)
        {
            var existing = _campaigns.FirstOrDefault(c => c.Id == id);
            if (existing is null) return null;
            CopyInto(existing, campaign);
            return existing;
        }
    }

    public bool Delete(string id)
    {
        lock (_lock)
        {
            var existing = _campaigns.FirstOrDefault(c => c.Id == id);
            if (existing is null) return false;
            _campaigns.Remove(existing);
            return true;
        }
    }

    // GR-003: only campaigns that are "Under approval" may be approved/rejected.
    public TransitionResult Approve(string id) => Transition(id, requiredStatus: "Under approval", newStatus: "Active");

    public TransitionResult Reject(string id) => Transition(id, requiredStatus: "Under approval", newStatus: "Draft");

    public Campaign? Clone(string id)
    {
        lock (_lock)
        {
            var source = _campaigns.FirstOrDefault(c => c.Id == id);
            if (source is null) return null;

            var copy = new Campaign();
            CopyInto(copy, source);
            copy.Id = Guid.NewGuid().ToString();
            copy.Name = $"{source.Name} (Copy)";
            copy.Status = "Draft";
            // Give the clone its own fresh (non-zero) dummy metrics.
            copy.TargetedPopulation = 0;
            copy.Accepted = 0;
            copy.Declined = 0;
            copy.ClickedUnfinished = 0;
            EnsureMetrics(copy);
            _campaigns.Add(copy);
            return copy;
        }
    }

    public DashboardSummary GetDashboard()
    {
        lock (_lock)
        {
            return new DashboardSummary
            {
                TotalCampaigns = _campaigns.Count,
                ActiveCampaigns = _campaigns.Count(c => c.Status == "Active"),
                TotalTargetedPopulation = _campaigns.Sum(c => c.TargetedPopulation),
                TotalAccepted = _campaigns.Sum(c => c.Accepted),
                TotalDeclined = _campaigns.Sum(c => c.Declined),
                TotalClickedUnfinished = _campaigns.Sum(c => c.ClickedUnfinished),
                Campaigns = _campaigns.Select(c => new CampaignPerformance
                {
                    Id = c.Id,
                    Name = c.Name,
                    Status = c.Status,
                    TargetedPopulation = c.TargetedPopulation,
                    Accepted = c.Accepted,
                    Declined = c.Declined,
                    ClickedUnfinished = c.ClickedUnfinished
                }).ToList()
            };
        }
    }

    /// <summary>
    /// Moves a campaign from <paramref name="requiredStatus"/> to
    /// <paramref name="newStatus"/>. Fails (without mutating) if the campaign is
    /// missing or not currently in the required status.
    /// </summary>
    private TransitionResult Transition(string id, string requiredStatus, string newStatus)
    {
        lock (_lock)
        {
            var existing = _campaigns.FirstOrDefault(c => c.Id == id);
            if (existing is null)
                return new TransitionResult(TransitionOutcome.NotFound, null);
            if (!string.Equals(existing.Status, requiredStatus, StringComparison.OrdinalIgnoreCase))
                return new TransitionResult(TransitionOutcome.InvalidTransition, existing);

            existing.Status = newStatus;
            return new TransitionResult(TransitionOutcome.Success, existing);
        }
    }

    /// <summary>
    /// Guarantees a campaign always has non-zero dummy metrics. Any field left at
    /// 0 is filled: targetedPopulation from the segment reach (or a random size),
    /// and accepted/declined/clicked as a realistic split of the population.
    /// </summary>
    private void EnsureMetrics(Campaign c)
    {
        if (c.TargetedPopulation <= 0)
            c.TargetedPopulation = c.EstimatedReach > 0 ? c.EstimatedReach : _rng.Next(8000, 30001);

        var t = c.TargetedPopulation;
        if (c.Accepted <= 0) c.Accepted = Math.Max(1, (int)(t * NextRatio(0.25, 0.40)));
        if (c.Declined <= 0) c.Declined = Math.Max(1, (int)(t * NextRatio(0.20, 0.35)));
        if (c.ClickedUnfinished <= 0) c.ClickedUnfinished = Math.Max(1, (int)(t * NextRatio(0.10, 0.20)));

        // Keep the population at least as large as the decided total.
        var decided = c.Accepted + c.Declined + c.ClickedUnfinished;
        if (c.TargetedPopulation < decided) c.TargetedPopulation = decided;
    }

    private double NextRatio(double lo, double hi) => lo + _rng.NextDouble() * (hi - lo);

    /// <summary>Copies all editable fields from <paramref name="src"/> into <paramref name="dest"/>.</summary>
    private static void CopyInto(Campaign dest, Campaign src)
    {
        dest.Name = src.Name;
        dest.Description = src.Description;
        dest.Keywords = src.Keywords;
        dest.ProductCategory = src.ProductCategory;
        dest.Priority = src.Priority;
        dest.StartDate = src.StartDate;
        dest.EndDate = src.EndDate;
        dest.Channels = src.Channels ?? new();
        dest.Assets = src.Assets ?? new();
        dest.SegmentIds = src.SegmentIds ?? new();
        dest.ManualUploadName = src.ManualUploadName;
        dest.EstimatedReach = src.EstimatedReach;
        dest.WebLocations = src.WebLocations ?? new();
        dest.MobileLocations = src.MobileLocations ?? new();
        dest.Status = string.IsNullOrWhiteSpace(src.Status) ? dest.Status : src.Status;
        dest.TargetedPopulation = src.TargetedPopulation;
        dest.Accepted = src.Accepted;
        dest.Declined = src.Declined;
        dest.ClickedUnfinished = src.ClickedUnfinished;
    }
}
