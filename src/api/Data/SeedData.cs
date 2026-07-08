using MarketingApi.Models;

namespace MarketingApi.Data;

/// <summary>
/// In-memory seed data for the POC. This mirrors src/data/*.json (the dummy data
/// used by the frontend). Keep both in sync — see CLAUDE.md §6 and §8.
/// </summary>
public static class SeedData
{
    public static List<Campaign> Campaigns() => new()
    {
        new Campaign
        {
            Id = "c1a11111-1111-1111-1111-111111111111",
            Name = "Summer Savings Boost",
            Description = "Promote high-yield savings to existing customers.",
            Channel = "Email",
            Status = "Active",
            StartDate = "2026-06-01",
            EndDate = "2026-08-31",
            TargetedPopulation = 12500,
            Accepted = 4200,
            Declined = 3100,
            ClickedUnfinished = 1800
        },
        new Campaign
        {
            Id = "c2a22222-2222-2222-2222-222222222222",
            Name = "Cashback Card Upgrade",
            Description = "Upsell premium cashback credit card.",
            Channel = "Push",
            Status = "Active",
            StartDate = "2026-05-15",
            EndDate = "2026-07-15",
            TargetedPopulation = 9800,
            Accepted = 2600,
            Declined = 4100,
            ClickedUnfinished = 1500
        },
        new Campaign
        {
            Id = "c3a33333-3333-3333-3333-333333333333",
            Name = "Refer-a-Friend Bonus",
            Description = "Reward customers who refer new members.",
            Channel = "SMS",
            Status = "Paused",
            StartDate = "2026-04-01",
            EndDate = "2026-06-30",
            TargetedPopulation = 6400,
            Accepted = 1900,
            Declined = 2200,
            ClickedUnfinished = 900
        },
        new Campaign
        {
            Id = "c4a44444-4444-4444-4444-444444444444",
            Name = "Auto Loan Rate Drop",
            Description = "Notify eligible customers about lower auto loan rates.",
            Channel = "Web",
            Status = "Completed",
            StartDate = "2026-01-10",
            EndDate = "2026-03-10",
            TargetedPopulation = 15200,
            Accepted = 5400,
            Declined = 6100,
            ClickedUnfinished = 2100
        },
        new Campaign
        {
            Id = "c5a55555-5555-5555-5555-555555555555",
            Name = "New Mobile App Launch",
            Description = "Drive adoption of the redesigned mobile app.",
            Channel = "Email",
            Status = "Draft",
            StartDate = "2026-07-20",
            EndDate = "2026-09-20",
            TargetedPopulation = 20000,
            Accepted = 0,
            Declined = 0,
            ClickedUnfinished = 0
        }
    };

    public static List<UserSegment> Segments() => new()
    {
        new UserSegment
        {
            Id = "s1a11111-1111-1111-1111-111111111111",
            Name = "California Adults 25+",
            Description = "Customers older than 25 living in California.",
            BaseSegmentId = null,
            MatchLogic = "AND",
            Rules = new()
            {
                new SegmentRule { Criteria = "Age", Operator = "Greater than", Value = "25" },
                new SegmentRule { Criteria = "State", Operator = "is", Value = "CA" }
            },
            EstimatedReach = 17754
        },
        new UserSegment
        {
            Id = "s2a22222-2222-2222-2222-222222222222",
            Name = "New Jersey Prospects",
            Description = "Prospects located in New Jersey.",
            BaseSegmentId = null,
            MatchLogic = "OR",
            Rules = new()
            {
                new SegmentRule { Criteria = "State", Operator = "is", Value = "NJ" }
            },
            EstimatedReach = 8420
        }
    };
}
