using MarketingApi.Models;
using MarketingApi.Services;
using Xunit;

namespace MarketingApi.Tests;

public class SegmentServiceTests
{
    private static UserSegment SampleSegment() => new()
    {
        Name = "Test Segment",
        Description = "desc",
        MatchLogic = "AND",
        Rules = new()
        {
            new SegmentRule { Criteria = "Age", Operator = "Greater than", Value = "30" }
        }
    };

    [Fact]
    public void GetAll_ReturnsSeededSegments()
    {
        var service = new SegmentService();
        Assert.Equal(2, service.GetAll().Count());
    }

    [Fact]
    public void Create_AssignsIdAndEstimatesReach()
    {
        var service = new SegmentService();
        var created = service.Create(SampleSegment());

        Assert.False(string.IsNullOrWhiteSpace(created.Id));
        Assert.True(created.EstimatedReach > 0);
        Assert.NotNull(service.GetById(created.Id));
    }

    [Fact]
    public void Update_ModifiesRulesAndLogic()
    {
        var service = new SegmentService();
        var created = service.Create(SampleSegment());

        var edit = SampleSegment();
        edit.MatchLogic = "OR";
        edit.Rules.Add(new SegmentRule { Criteria = "State", Operator = "is", Value = "CA" });

        var updated = service.Update(created.Id, edit);
        Assert.NotNull(updated);
        Assert.Equal("OR", updated!.MatchLogic);
        Assert.Equal(2, updated.Rules.Count);
    }

    [Fact]
    public void Delete_RemovesSegment()
    {
        var service = new SegmentService();
        var created = service.Create(SampleSegment());

        Assert.True(service.Delete(created.Id));
        Assert.Null(service.GetById(created.Id));
    }

    [Fact]
    public void EstimateReach_AndIsNarrowerThanOr()
    {
        var service = new SegmentService();

        var andSeg = SampleSegment();
        andSeg.MatchLogic = "AND";
        andSeg.Rules.Add(new SegmentRule { Criteria = "State", Operator = "is", Value = "CA" });

        var orSeg = SampleSegment();
        orSeg.MatchLogic = "OR";
        orSeg.Rules.Add(new SegmentRule { Criteria = "State", Operator = "is", Value = "CA" });

        var andCreated = service.Create(andSeg);
        var orCreated = service.Create(orSeg);

        Assert.True(andCreated.EstimatedReach < orCreated.EstimatedReach);
    }
}
