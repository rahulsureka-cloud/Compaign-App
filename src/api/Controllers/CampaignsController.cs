using MarketingApi.Models;
using MarketingApi.Services;
using MarketingApi.Validation;
using Microsoft.AspNetCore.Mvc;

namespace MarketingApi.Controllers;

[ApiController]
[Route("api/campaigns")]
public class CampaignsController : ControllerBase
{
    private readonly ICampaignService _service;

    public CampaignsController(ICampaignService service)
    {
        _service = service;
    }

    // GET /api/campaigns  or  GET /api/campaigns?status=Active
    [HttpGet]
    public ActionResult<IEnumerable<Campaign>> GetAll([FromQuery] string? status = null)
        => Ok(_service.GetAll(status));

    // GET /api/campaigns/dashboard  (declared before {id} so it isn't captured as an id)
    [HttpGet("dashboard")]
    public ActionResult<DashboardSummary> GetDashboard() => Ok(_service.GetDashboard());

    // GET /api/campaigns/{id}
    [HttpGet("{id}")]
    public ActionResult<Campaign> GetById(string id)
    {
        var campaign = _service.GetById(id);
        return campaign is null ? NotFound() : Ok(campaign);
    }

    // POST /api/campaigns
    [HttpPost]
    public ActionResult<Campaign> Create([FromBody] Campaign campaign)
    {
        var error = CampaignValidator.Validate(campaign);   // GR-001, GR-002
        if (error is not null) return BadRequest(new { message = error });

        var created = _service.Create(campaign);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/campaigns/{id}
    [HttpPut("{id}")]
    public ActionResult<Campaign> Update(string id, [FromBody] Campaign campaign)
    {
        var error = CampaignValidator.Validate(campaign);   // GR-001, GR-002
        if (error is not null) return BadRequest(new { message = error });

        var updated = _service.Update(id, campaign);
        return updated is null ? NotFound() : Ok(updated);
    }

    // DELETE /api/campaigns/{id}
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
        => _service.Delete(id) ? NoContent() : NotFound();

    // POST /api/campaigns/{id}/approve
    [HttpPost("{id}/approve")]
    public ActionResult<Campaign> Approve(string id) => HandleTransition(_service.Approve(id));

    // POST /api/campaigns/{id}/reject
    [HttpPost("{id}/reject")]
    public ActionResult<Campaign> Reject(string id) => HandleTransition(_service.Reject(id));

    // GR-003: 404 if missing, 409 if not currently "Under approval", else 200.
    private ActionResult<Campaign> HandleTransition(TransitionResult result) => result.Outcome switch
    {
        TransitionOutcome.NotFound => NotFound(),
        TransitionOutcome.InvalidTransition => Conflict(new
        {
            message = $"Only campaigns that are 'Under approval' can be approved or rejected. " +
                      $"Current status: '{result.Campaign!.Status}'."
        }),
        _ => Ok(result.Campaign)
    };

    // POST /api/campaigns/{id}/clone
    [HttpPost("{id}/clone")]
    public ActionResult<Campaign> Clone(string id)
    {
        var created = _service.Clone(id);
        return created is null
            ? NotFound()
            : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
