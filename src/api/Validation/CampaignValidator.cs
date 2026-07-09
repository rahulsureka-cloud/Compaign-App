using System.Globalization;
using MarketingApi.Models;

namespace MarketingApi.Validation;

/// <summary>
/// Request-level guardrails for campaigns (see Guardrails/Guardrails.md).
/// Returns a human-readable error message, or null when the campaign is valid.
/// </summary>
public static class CampaignValidator
{
    public static string? Validate(Campaign c)
    {
        // Name is required.
        if (string.IsNullOrWhiteSpace(c.Name))
            return "Campaign name is required.";

        // GR-001: Date sanity — parseable ISO dates and endDate >= startDate.
        var hasStart = !string.IsNullOrWhiteSpace(c.StartDate);
        var hasEnd = !string.IsNullOrWhiteSpace(c.EndDate);
        DateTime start = default, end = default;

        if (hasStart && !DateTime.TryParse(c.StartDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out start))
            return "Start date is not a valid date.";
        if (hasEnd && !DateTime.TryParse(c.EndDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out end))
            return "End date is not a valid date.";
        if (hasStart && hasEnd && end < start)
            return "End date must be on or after the start date.";

        // GR-002: Numeric ranges — non-negative, and decisions cannot exceed the population.
        if (c.TargetedPopulation < 0 || c.Accepted < 0 || c.Declined < 0 || c.ClickedUnfinished < 0)
            return "Targeted population and decision counts cannot be negative.";
        if (c.Accepted + c.Declined + c.ClickedUnfinished > c.TargetedPopulation)
            return "Accepted + declined + clicked cannot exceed the targeted population.";

        return null;
    }
}
