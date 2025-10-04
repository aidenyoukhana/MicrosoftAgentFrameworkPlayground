using Microsoft.AspNetCore.Mvc;
using Microsoft.Agents.AI;
using Microsoft.Agents.AI.OpenAI;
using Azure.AI.OpenAI;
using Azure.Identity;
using Microsoft.Extensions.AI;
using Azure.Core;
using System.ClientModel;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly AIAgent _agent;

    public ChatController()
    {
        // Initialize the agent
        var endpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT") ?? "https://your-resource.openai.azure.com/";
        var apiKey = Environment.GetEnvironmentVariable("AZURE_OPENAI_API_KEY");

        AzureOpenAIClient client;
        if (!string.IsNullOrEmpty(apiKey))
        {
            // Use API key authentication
            client = new AzureOpenAIClient(new Uri(endpoint), new ApiKeyCredential(apiKey));
        }
        else
        {
            // Fallback to Azure CLI authentication
            var credential = new AzureCliCredential();
            client = new AzureOpenAIClient(new Uri(endpoint), credential);
        }

        var deploymentName = Environment.GetEnvironmentVariable("AZURE_OPENAI_DEPLOYMENT_NAME") ?? "gpt-4o-mini";
        var chatClient = client.GetChatClient(deploymentName);
        _agent = new ChatClientAgent(chatClient.AsIChatClient(), instructions: "You are a helpful assistant.");
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
    {
        var response = await _agent.RunAsync(request.Message);
        return Ok(new { message = response.Text });
    }
}

public class ChatRequest
{
    public string Message { get; set; } = string.Empty;
}