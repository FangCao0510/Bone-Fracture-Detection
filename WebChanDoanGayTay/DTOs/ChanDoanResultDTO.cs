using System.Text.Json.Serialization;

public class ChanDoanResultDTO
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("image_path")]
    public string ImagePath { get; set; }

    [JsonPropertyName("prediction_text")]
    public string PredictionText { get; set; }

    [JsonPropertyName("diagnostic_image_path")]
    public string DiagnosticImagePath { get; set; }
}