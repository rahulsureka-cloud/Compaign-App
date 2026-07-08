using MarketingApi.Data;
using MarketingApi.Models;

namespace MarketingApi.Services;

public interface ICampaignService
{
    IEnumerable<Campaign> GetAll();
    Campaign? GetById(string id);
    Campaign Create(Campaign campaign);
    Campaign? Update(string id, Campaign campaign);
    bool Delete(string id);
    DashboardSummary GetDashboard();
}

/// <summary>Thread-safe in-memory campaign store for the POC.</summary>
public class CampaignService : ICampaignService
{
    private readonly List<Campaign> _campaigns;
    private readonly object _lock = new();

    public CampaignService()
    {
        _campaigns = SeedData.Campaigns();
    }

    public IEnumerable<Campaign> GetAll()
    {
        lock (_lock) { return _campaigns.ToList(); }
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

            existing.Name = campaign.Name;
            existing.Description = campaign.Description;
            existing.Channel = campaign.Channel;
            existing.Status = campaign.Status;
            existing.StartDate = campaign.StartDate;
            existing.EndDate = campaign.EndDate;
            existing.TargetedPopulation = campaign.TargetedPopulation;
            existing.Accepted = campaign.Accepted;
            existing.Declined = campaign.Declined;
            existing.ClickedUnfinished = campaign.ClickedUnfinished;
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
}
