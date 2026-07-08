using MarketingApi.Data;
using MarketingApi.Models;

namespace MarketingApi.Services;

public interface ISegmentService
{
    IEnumerable<UserSegment> GetAll();
    UserSegment? GetById(string id);
    UserSegment Create(UserSegment segment);
    UserSegment? Update(string id, UserSegment segment);
    bool Delete(string id);
}

/// <summary>Thread-safe in-memory user-segment store for the POC.</summary>
public class SegmentService : ISegmentService
{
    private readonly List<UserSegment> _segments;
    private readonly object _lock = new();

    public SegmentService()
    {
        _segments = SeedData.Segments();
    }

    public IEnumerable<UserSegment> GetAll()
    {
        lock (_lock) { return _segments.ToList(); }
    }

    public UserSegment? GetById(string id)
    {
        lock (_lock) { return _segments.FirstOrDefault(s => s.Id == id); }
    }

    public UserSegment Create(UserSegment segment)
    {
        lock (_lock)
        {
            segment.Id = Guid.NewGuid().ToString();
            if (segment.EstimatedReach <= 0)
                segment.EstimatedReach = EstimateReach(segment);
            _segments.Add(segment);
            return segment;
        }
    }

    public UserSegment? Update(string id, UserSegment segment)
    {
        lock (_lock)
        {
            var existing = _segments.FirstOrDefault(s => s.Id == id);
            if (existing is null) return null;

            existing.Name = segment.Name;
            existing.Description = segment.Description;
            existing.BaseSegmentId = segment.BaseSegmentId;
            existing.MatchLogic = segment.MatchLogic;
            existing.Rules = segment.Rules;
            existing.EstimatedReach = segment.EstimatedReach > 0
                ? segment.EstimatedReach
                : EstimateReach(segment);
            return existing;
        }
    }

    public bool Delete(string id)
    {
        lock (_lock)
        {
            var existing = _segments.FirstOrDefault(s => s.Id == id);
            if (existing is null) return false;
            _segments.Remove(existing);
            return true;
        }
    }

    /// <summary>
    /// Rough deterministic reach estimate for the POC: a base population reduced
    /// by each rule. AND narrows more aggressively than OR.
    /// </summary>
    private static int EstimateReach(UserSegment segment)
    {
        const int basePopulation = 100000;
        if (segment.Rules.Count == 0) return basePopulation;

        double factor = segment.MatchLogic == "AND" ? 0.45 : 0.70;
        double reach = basePopulation;
        foreach (var _ in segment.Rules)
            reach *= factor;

        return (int)Math.Round(reach);
    }
}
