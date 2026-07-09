using MarketingApi.Models;

namespace MarketingApi.Data;

/// <summary>
/// In-memory seed data for the POC. This mirrors src/data/*.json (the dummy data
/// used by the frontend). Keep both in sync — see CLAUDE.md §6 and §8.
/// </summary>
public static class SeedData
{
    // Segment ids referenced by campaigns (match Segments() below).
    private const string SegCaAdults = "s1a11111-1111-1111-1111-111111111111";
    private const string SegNjProspects = "s2a22222-2222-2222-2222-222222222222";

    public static List<Campaign> Campaigns() => new()
    {
        new Campaign
        {
            Id = "c1a11111-1111-1111-1111-111111111111",
            Name = "Summer Savings Boost",
            Description = "Promote high-yield savings to existing customers.",
            Keywords = "savings, summer, high-yield",
            ProductCategory = "Savings",
            Priority = "High",
            StartDate = "2026-06-01",
            EndDate = "2026-08-31",
            Channels = new() { "In-app", "Email" },
            Assets = new()
            {
                new CampaignAsset { Type = "Image", FileName = "summer-savings.png", AltText = "Summer savings banner", CtaLink = "/savings" },
                new CampaignAsset { Type = "Text", Text = "Boost your savings this summer with 4.5% APY." }
            },
            SegmentIds = new() { SegCaAdults },
            EstimatedReach = 17754,
            WebLocations = new() { "Accounts-top banner" },
            MobileLocations = new() { "Accounts-top banner" },
            Status = "Active",
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
            Keywords = "cashback, credit card, upgrade",
            ProductCategory = "Credit Card",
            Priority = "Medium",
            StartDate = "2026-05-15",
            EndDate = "2026-07-15",
            Channels = new() { "In-app", "SMS", "Ads" },
            Assets = new()
            {
                new CampaignAsset { Type = "HTML", FileName = "cashback.html", Html = "<h1>Upgrade &amp; earn 3% cashback</h1>" }
            },
            SegmentIds = new() { SegCaAdults, SegNjProspects },
            EstimatedReach = 26174,
            WebLocations = new() { "Accounts-top banner", "Accounts-bottom banner" },
            MobileLocations = new() { "Dashboard banner" },
            Status = "Active",
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
            Keywords = "referral, bonus",
            ProductCategory = "Checking",
            Priority = "Low",
            StartDate = "2026-04-01",
            EndDate = "2026-06-30",
            Channels = new() { "Email" },
            Assets = new() { new CampaignAsset { Type = "Text", Text = "Refer a friend and get $50." } },
            SegmentIds = new(),
            EstimatedReach = 6400,
            WebLocations = new(),
            MobileLocations = new(),
            Status = "Draft",
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
            Keywords = "auto loan, rates",
            ProductCategory = "Auto Loan",
            Priority = "High",
            StartDate = "2026-01-10",
            EndDate = "2026-03-10",
            Channels = new() { "In-app", "Email", "Social media" },
            Assets = new()
            {
                new CampaignAsset { Type = "Image", FileName = "LoanPayment.png", AltText = "Auto loan rate drop" },
                new CampaignAsset { Type = "Image", FileName = "LoanPaymentv2.png", AltText = "Auto loan rate drop v2" }
            },
            SegmentIds = new() { SegCaAdults },
            EstimatedReach = 15200,
            WebLocations = new() { "Accounts-top banner" },
            MobileLocations = new() { "Accounts-top banner", "Accounts-bottom banner" },
            Status = "Completed",
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
            Keywords = "mobile, app, launch",
            ProductCategory = "Checking",
            Priority = "Medium",
            StartDate = "2026-07-20",
            EndDate = "2026-09-20",
            Channels = new() { "In-app", "Email", "SMS", "Social media", "Ads" },
            Assets = new() { new CampaignAsset { Type = "Text", Text = "The all-new app is here." } },
            SegmentIds = new(),
            EstimatedReach = 20000,
            WebLocations = new() { "Login screen" },
            MobileLocations = new() { "Dashboard banner" },
            Status = "In-progress",
            TargetedPopulation = 20000,
            Accepted = 3200,
            Declined = 2600,
            ClickedUnfinished = 1400
        },
        new Campaign
        {
            Id = "c6a66666-6666-6666-6666-666666666666",
            Name = "Premium Savings Cross-sell",
            Description = "Cross-sell premium savings to high-balance customers.",
            Keywords = "premium, savings, cross-sell",
            ProductCategory = "Savings",
            Priority = "Medium",
            StartDate = "2026-08-01",
            EndDate = "2026-10-01",
            Channels = new() { "In-app" },
            Assets = new()
            {
                new CampaignAsset { Type = "Image", FileName = "LoanPayment.png", AltText = "Premium savings" },
                new CampaignAsset { Type = "HTML", FileName = "LoanPayment.html", Html = "<p>Get approved for the car loan today...</p>" }
            },
            SegmentIds = new() { SegCaAdults, SegNjProspects },
            EstimatedReach = 56780,
            WebLocations = new() { "Accounts-top banner", "Accounts-bottom banner" },
            MobileLocations = new() { "Accounts-top banner", "Accounts-bottom banner" },
            Status = "Under approval",
            TargetedPopulation = 18000,
            Accepted = 2800,
            Declined = 3100,
            ClickedUnfinished = 1200
        },
        new Campaign
        {
            Id = "c7a77777-7777-7777-7777-777777777777",
            Name = "Digital Onboarding Push",
            Description = "Encourage digital-only users to complete onboarding.",
            Keywords = "onboarding, digital",
            ProductCategory = "Checking",
            Priority = "High",
            StartDate = "2026-07-25",
            EndDate = "2026-09-25",
            Channels = new() { "Email", "SMS" },
            Assets = new() { new CampaignAsset { Type = "Text", Text = "Finish setting up your account." } },
            SegmentIds = new() { SegNjProspects },
            EstimatedReach = 8420,
            WebLocations = new() { "Login screen" },
            MobileLocations = new() { "Dashboard banner" },
            Status = "Under approval",
            TargetedPopulation = 11000,
            Accepted = 1500,
            Declined = 1800,
            ClickedUnfinished = 700
        }
    };

    public static List<UserSegment> Segments() => new()
    {
        new UserSegment
        {
            Id = SegCaAdults,
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
            Id = SegNjProspects,
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
