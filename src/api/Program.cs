using MarketingApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Controllers + JSON (camelCase by default in ASP.NET Core).
builder.Services.AddControllers();

// In-memory stores are singletons so data persists across requests for the POC.
builder.Services.AddSingleton<ICampaignService, CampaignService>();
builder.Services.AddSingleton<ISegmentService, SegmentService>();

// Allow the React dev server (http://localhost:3000) to call the API.
const string CorsPolicy = "AllowReactDev";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Serve on port 5000 (see CLAUDE.md §2).
builder.WebHost.UseUrls("http://localhost:5000");

var app = builder.Build();

app.UseCors(CorsPolicy);
app.MapControllers();

// Simple health/root endpoint.
app.MapGet("/", () => Results.Ok(new { service = "Marketing Campaign Management API", status = "running" }));

app.Run();

// Exposed so the xUnit test project can reference the entry point.
public partial class Program { }