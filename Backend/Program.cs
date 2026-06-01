using Backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Register the PostgreSQL Database Context Middleware Service
builder.Services.AddDbContext<BoardDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

// 1. ADD THE CORS POLICY RULE HERE
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Your React app location
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 2. ACTIVATE THE CORS MIDDLEWARE CHECKPOINT HERE
app.UseCors("AllowReact");

app.UseAuthorization();

app.MapControllers();

// --- INSERT THIS DATA SEEDING BLOCK ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<BoardDbContext>();
    // Automatically apply any pending migrations and run the seeder
    context.Database.EnsureCreated();
    Backend.Data.DbSeeder.SeedData(context);
}

app.Run();