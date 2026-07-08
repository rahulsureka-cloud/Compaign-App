using MarketingApi.Models;
using MarketingApi.Services;
using Xunit;

namespace MarketingApi.Tests;

public class CampaignServiceTests
{
    private static Campaign SampleCampaign() => new()
    {
        Name = "Test Campaign",
        Description = "desc",
        Channel = "Email",
        Status = "Draft",
        StartDate = "2026-07-01",
        EndDate = "2026-08-01",
        TargetedPopulation = 1000,
        Accepted = 100,
        Declined = 200,
        ClickedUnfinished = 50
    };

    [Fact]
    public void GetAll_ReturnsSeededCampaigns()
    {
        var service = new CampaignService();
        Assert.Equal(5, service.GetAll().Count());
    }

    [Fact]
    public void Create_AssignsIdAndPersists()
    {
        var service = new CampaignService();
        var created = service.Create(SampleCampaign());

        Assert.False(string.IsNullOrWhiteSpace(created.Id));
        Assert.NotNull(service.GetById(created.Id));
        Assert.Equal(6, service.GetAll().Count());
    }

    [Fact]
    public void Update_ModifiesExistingCampaign()
    {
        var service = new CampaignService();
        var created = service.Create(SampleCampaign());

        var edit = SampleCampaign();
        edit.Name = "Renamed";
        edit.Accepted = 999;
        var updated = service.Update(created.Id, edit);

        Assert.NotNull(updated);
        Assert.Equal("Renamed", updated!.Name);
        Assert.Equal(999, updated.Accepted);
    }

    [Fact]
    public void Update_ReturnsNull_WhenNotFound()
    {
        var service = new CampaignService();
        Assert.Null(service.Update("does-not-exist", SampleCampaign()));
    }

    [Fact]
    public void Delete_RemovesCampaign()
    {
        var service = new CampaignService();
        var created = service.Create(SampleCampaign());

        Assert.True(service.Delete(created.Id));
        Assert.Null(service.GetById(created.Id));
    }

    [Fact]
    public void Delete_ReturnsFalse_WhenNotFound()
    {
        var service = new CampaignService();
        Assert.False(service.Delete("nope"));
    }

    [Fact]
    public void GetDashboard_AggregatesTotals()
    {
        var service = new CampaignService();
        var summary = service.GetDashboard();

        // Seed totals: 12500 + 9800 + 6400 + 15200 + 20000
        Assert.Equal(63900, summary.TotalTargetedPopulation);
        // Accepted: 4200 + 2600 + 1900 + 5400 + 0
        Assert.Equal(14100, summary.TotalAccepted);
        Assert.Equal(2, summary.ActiveCampaigns);
        Assert.Equal(5, summary.Campaigns.Count);
    }
}
