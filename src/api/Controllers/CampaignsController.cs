using MarketingApi.Models;
using MarketingApi.Services;
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

    // GET /api/campaigns
    [HttpGet]
    public ActionResult<IEnumerable<Campaign>> GetAll() => Ok(_service.GetAll());

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
        if (string.IsNullOrWhiteSpace(campaign.Name))
            return BadRequest(new { message = "Campaign name is required." });

        var created = _service.Create(campaign);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/campaigns/{id}
    [HttpPut("{id}")]
    public ActionResult<Campaign> Update(string id, [FromBody] Campaign campaign)
    {
        if (string.IsNullOrWhiteSpace(campaign.Name))
            return BadRequest(new { message = "Campaign name is required." });

        var updated = _service.Update(id, campaign);
        return updated is null ? NotFound() : Ok(updated);
    }

    // DELETE /api/campaigns/{id}
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
        => _service.Delete(id) ? NoContent() : NotFound();
}
