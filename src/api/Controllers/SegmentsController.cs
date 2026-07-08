using MarketingApi.Models;
using MarketingApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace MarketingApi.Controllers;

[ApiController]
[Route("api/segments")]
public class SegmentsController : ControllerBase
{
    private readonly ISegmentService _service;

    public SegmentsController(ISegmentService service)
    {
        _service = service;
    }

    // GET /api/segments
    [HttpGet]
    public ActionResult<IEnumerable<UserSegment>> GetAll() => Ok(_service.GetAll());

    // GET /api/segments/{id}
    [HttpGet("{id}")]
    public ActionResult<UserSegment> GetById(string id)
    {
        var segment = _service.GetById(id);
        return segment is null ? NotFound() : Ok(segment);
    }

    // POST /api/segments
    [HttpPost]
    public ActionResult<UserSegment> Create([FromBody] UserSegment segment)
    {
        if (string.IsNullOrWhiteSpace(segment.Name))
            return BadRequest(new { message = "Segment name is required." });
        if (segment.Rules is null || segment.Rules.Count == 0)
            return BadRequest(new { message = "At least one segment rule is required." });

        var created = _service.Create(segment);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/segments/{id}
    [HttpPut("{id}")]
    public ActionResult<UserSegment> Update(string id, [FromBody] UserSegment segment)
    {
        if (string.IsNullOrWhiteSpace(segment.Name))
            return BadRequest(new { message = "Segment name is required." });

        var updated = _service.Update(id, segment);
        return updated is null ? NotFound() : Ok(updated);
    }

    // DELETE /api/segments/{id}
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
        => _service.Delete(id) ? NoContent() : NotFound();
}
