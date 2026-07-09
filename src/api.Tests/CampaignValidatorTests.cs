using MarketingApi.Models;
using MarketingApi.Validation;
using Xunit;

namespace MarketingApi.Tests;

public class CampaignValidatorTests
{
    private static Campaign Valid() => new()
    {
        Name = "Valid Campaign",
        StartDate = "2026-07-01",
        EndDate = "2026-08-01",
        TargetedPopulation = 1000,
        Accepted = 300,
        Declined = 200,
        ClickedUnfinished = 100
    };

    [Fact]
    public void Valid_Campaign_PassesValidation()
        => Assert.Null(CampaignValidator.Validate(Valid()));

    [Fact]
    public void Name_IsRequired()
    {
        var c = Valid();
        c.Name = "  ";
        Assert.Equal("Campaign name is required.", CampaignValidator.Validate(c));
    }

    // GR-001
    [Fact]
    public void EndDate_BeforeStartDate_IsRejected()
    {
        var c = Valid();
        c.StartDate = "2026-08-01";
        c.EndDate = "2026-07-01";
        Assert.Equal("End date must be on or after the start date.", CampaignValidator.Validate(c));
    }

    [Fact]
    public void Unparseable_Date_IsRejected()
    {
        var c = Valid();
        c.EndDate = "not-a-date";
        Assert.Equal("End date is not a valid date.", CampaignValidator.Validate(c));
    }

    [Fact]
    public void EqualStartAndEndDate_IsAllowed()
    {
        var c = Valid();
        c.StartDate = c.EndDate = "2026-07-15";
        Assert.Null(CampaignValidator.Validate(c));
    }

    // GR-002
    [Fact]
    public void Negative_Metric_IsRejected()
    {
        var c = Valid();
        c.Declined = -1;
        Assert.Equal("Targeted population and decision counts cannot be negative.", CampaignValidator.Validate(c));
    }

    [Fact]
    public void Decisions_ExceedingPopulation_IsRejected()
    {
        var c = Valid();
        c.TargetedPopulation = 500;
        c.Accepted = 300;
        c.Declined = 300; // 300 + 300 + 100 = 700 > 500
        Assert.Equal("Accepted + declined + clicked cannot exceed the targeted population.", CampaignValidator.Validate(c));
    }

    [Fact]
    public void AllZeroMetrics_AreAllowed()
    {
        var c = Valid();
        c.TargetedPopulation = 0;
        c.Accepted = c.Declined = c.ClickedUnfinished = 0;
        Assert.Null(CampaignValidator.Validate(c));
    }
}
