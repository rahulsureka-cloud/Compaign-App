namespace MarketingApi.Models;

/// <summary>A single segment criteria rule, e.g. "Age Greater than 25".</summary>
public class SegmentRule
{
    public string Criteria { get; set; } = string.Empty;  // Age | State | ...
    public string Operator { get; set; } = string.Empty;  // "Greater than" | "is" | ...
    public string Value { get; set; } = string.Empty;
}

/// <summary>
/// A user segment. Shapes must stay in sync with CLAUDE.md §6, the UserSegment
/// React component, and src/data/segments.json.
/// </summary>
public class UserSegment
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    /// <summary>Optional base segment ("Select existing segment").</summary>
    public string? BaseSegmentId { get; set; }

    /// <summary>How the rules combine: AND | OR.</summary>
    public string MatchLogic { get; set; } = "AND";

    public List<SegmentRule> Rules { get; set; } = new();

    /// <summary>Estimated reach shown in the Audience summary.</summary>
    public int EstimatedReach { get; set; }
}
