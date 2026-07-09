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
        Keywords = "test",
        ProductCategory = "Savings",
        Priority = "High",
        Channels = new() { "In-app", "Email" },
        Status = "Draft",
        StartDate = "2026-07-01",
        EndDate = "2026-08-01",
        Assets = new() { new CampaignAsset { Type = "Text", Text = "hello" } },
        SegmentIds = new() { "s1a11111-1111-1111-1111-111111111111" },
        WebLocations = new() { "Accounts-top banner" },
        MobileLocations = new() { "Dashboard banner" },
        EstimatedReach = 5000,
        TargetedPopulation = 1000,
        Accepted = 100,
        Declined = 200,
        ClickedUnfinished = 50
    };

    [Fact]
    public void GetAll_ReturnsSeededCampaigns()
    {
        var service = new CampaignService();
        Assert.Equal(7, service.GetAll().Count());
    }

    [Fact]
    public void GetAll_FiltersByStatus()
    {
        var service = new CampaignService();
        Assert.Equal(2, service.GetAll("Active").Count());
        Assert.Equal(2, service.GetAll("Under approval").Count());
        Assert.Single(service.GetAll("Completed"));
    }

    [Fact]
    public void Create_AssignsIdAndPersistsWithChannels()
    {
        var service = new CampaignService();
        var created = service.Create(SampleCampaign());

        Assert.False(string.IsNullOrWhiteSpace(created.Id));
        Assert.Equal(2, created.Channels.Count);
        Assert.NotNull(service.GetById(created.Id));
        Assert.Equal(8, service.GetAll().Count());
    }

    [Fact]
    public void Create_FillsZeroMetricsWithNonZeroDummyData()
    {
        var service = new CampaignService();
        var c = SampleCampaign();
        c.TargetedPopulation = 0;
        c.Accepted = 0;
        c.Declined = 0;
        c.ClickedUnfinished = 0;
        c.EstimatedReach = 12000;

        var created = service.Create(c);

        Assert.True(created.TargetedPopulation > 0);
        Assert.True(created.Accepted > 0);
        Assert.True(created.Declined > 0);
        Assert.True(created.ClickedUnfinished > 0);
    }

    [Fact]
    public void Seed_HasNoZeroMetricCampaigns()
    {
        var service = new CampaignService();
        Assert.All(service.GetAll(), c =>
        {
            Assert.True(c.TargetedPopulation > 0);
            Assert.True(c.Accepted > 0);
            Assert.True(c.Declined > 0);
            Assert.True(c.ClickedUnfinished > 0);
        });
    }

    [Fact]
    public void Update_ModifiesExistingCampaign()
    {
        var service = new CampaignService();
        var created = service.Create(SampleCampaign());

        var edit = SampleCampaign();
        edit.Name = "Renamed";
        edit.Channels = new() { "SMS" };
        var updated = service.Update(created.Id, edit);

        Assert.NotNull(updated);
        Assert.Equal("Renamed", updated!.Name);
        Assert.Equal(new[] { "SMS" }, updated.Channels);
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
    public void Approve_SetsStatusActive_WhenUnderApproval()
    {
        var service = new CampaignService();
        var underApproval = service.GetAll("Under approval").First();
        var result = service.Approve(underApproval.Id);
        Assert.Equal(TransitionOutcome.Success, result.Outcome);
        Assert.Equal("Active", result.Campaign!.Status);
    }

    [Fact]
    public void Reject_SetsStatusDraft_WhenUnderApproval()
    {
        var service = new CampaignService();
        var underApproval = service.GetAll("Under approval").First();
        var result = service.Reject(underApproval.Id);
        Assert.Equal(TransitionOutcome.Success, result.Outcome);
        Assert.Equal("Draft", result.Campaign!.Status);
    }

    [Fact]
    public void Approve_IsRejectedForNonUnderApprovalStatus()
    {
        var service = new CampaignService();
        var active = service.GetAll("Active").First();          // already Active
        var result = service.Approve(active.Id);
        Assert.Equal(TransitionOutcome.InvalidTransition, result.Outcome);
        Assert.Equal("Active", result.Campaign!.Status);        // unchanged
    }

    [Fact]
    public void Reject_IsRejectedForDraftStatus()
    {
        var service = new CampaignService();
        var draft = service.GetAll("Draft").First();
        var result = service.Reject(draft.Id);
        Assert.Equal(TransitionOutcome.InvalidTransition, result.Outcome);
        Assert.Equal("Draft", result.Campaign!.Status);         // unchanged
    }

    [Fact]
    public void Clone_CreatesDraftCopyWithResetMetrics()
    {
        var service = new CampaignService();
        var source = service.GetAll("Active").First();
        var clone = service.Clone(source.Id);

        Assert.NotNull(clone);
        Assert.NotEqual(source.Id, clone!.Id);
        Assert.EndsWith("(Copy)", clone.Name);
        Assert.Equal("Draft", clone.Status);
        Assert.True(clone.Accepted > 0);  // clones get fresh non-zero dummy metrics
        Assert.Equal(8, service.GetAll().Count());
    }

    [Fact]
    public void Approve_ReturnsNotFound_WhenMissing()
    {
        var service = new CampaignService();
        Assert.Equal(TransitionOutcome.NotFound, service.Approve("nope").Outcome);
    }

    [Fact]
    public void GetDashboard_AggregatesTotals()
    {
        var service = new CampaignService();
        var summary = service.GetDashboard();

        // Seed targeted: 12500+9800+6400+15200+20000+18000+11000
        Assert.Equal(92900, summary.TotalTargetedPopulation);
        // Accepted: 4200+2600+1900+5400+3200+2800+1500
        Assert.Equal(21600, summary.TotalAccepted);
        Assert.Equal(2, summary.ActiveCampaigns);
        Assert.Equal(7, summary.Campaigns.Count);
    }
}
