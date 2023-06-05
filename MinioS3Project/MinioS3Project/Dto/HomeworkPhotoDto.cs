using Minio.DataModel;

namespace MinioS3Project.Model;

public class HomeworkPhotoDto
{
    public required Item HomeworkPhoto { get; init; }
    
    public required string PreviewUrl { get; init; }
}