using System.Net;
using System.Reactive.Linq;
using Microsoft.AspNetCore.Mvc;
using Minio;
using Minio.DataModel;
using Minio.DataModel.Tags;
using MinioS3Project.Model;

namespace MinioS3Project.Controllers;

[ApiController]
[Route("[controller]")]
public class HomeworkPhotosController : ControllerBase
{
    private const string HomeworkBucketName = "homeworks";
    private readonly MinioClient _minioClient; 
        
    public HomeworkPhotosController(MinioClient minioClient)
    {
        _minioClient = minioClient;
    }
    
    [HttpGet("{taskId}")]
    public async Task<List<HomeworkPhotoDto>> GetAllPreviewAsync(int taskId)
    {
        var allHomeworkPhotos = await GetHomeworkPhotosAsync(taskId);
        var homeworkPhotoDtoList = new List<HomeworkPhotoDto>();
        foreach (var homeworkPhoto in allHomeworkPhotos)
        {
            var homeworkPreview = await GeneratePresignedUrl(homeworkPhoto.Key);
            homeworkPhotoDtoList.Add(new HomeworkPhotoDto()
            {
                HomeworkPhoto = homeworkPhoto,
                PreviewUrl = homeworkPreview
            });
        }

        return homeworkPhotoDtoList;
    }
    
    [HttpPost("upload")]
    public async Task<IActionResult> UploadHomework(IReadOnlyCollection<IFormFile> photos, int taskId)
    {
        if (photos.Count == 0)
        {
            return BadRequest("No photos were uploaded.");
        }

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
        if (photos.Any(photo => !allowedExtensions.Contains(Path.GetExtension(photo.FileName))))
        {
            return BadRequest($"Only image files {string.Join(", ", allowedExtensions)} are allowed.");
        }

        foreach (var photo in photos)
        {
            await UploadPhotoToMinio(photo, taskId);            
        }

        return Ok("Photo uploaded successfully.");
    }
    
    [HttpDelete("delete/{fileName}")]
    public async Task<IActionResult> DeletePhoto(string fileName)
    {
        var removeObjectArgs = new RemoveObjectArgs()
            .WithBucket(HomeworkBucketName)
            .WithObject(fileName);
        await _minioClient.RemoveObjectAsync(removeObjectArgs);
        return Ok("Photo deleted successfully.");
    }

    private async Task<List<Item>> GetHomeworkPhotosAsync(int taskId)
    {
        var allHomeworks = new List<Item>();
        
        var listArgs = new ListObjectsArgs().WithBucket(HomeworkBucketName);

        var observable =  _minioClient.ListObjectsAsync(listArgs);
        await observable.ForEachAsync(item =>
        {
            allHomeworks.Add(item);
        });
        return allHomeworks;
    }

    private async Task UploadPhotoToMinio(IFormFile photo, int taskId)
    {
        var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(photo.FileName)}";
        var tags = new Dictionary<string, string>
        {
            { "taskId-tag", taskId.ToString() }
        };

        var putObjectArgs = new PutObjectArgs()
            .WithBucket(HomeworkBucketName)
            .WithObject(uniqueFileName)
            .WithStreamData(photo.OpenReadStream())
            .WithObjectSize(photo.Length)
            .WithTagging(Tagging.GetObjectTags(tags))
            .WithContentType(photo.ContentType);
        
        await _minioClient.PutObjectAsync(putObjectArgs);
    }
    
    private async Task<string> GeneratePresignedUrl(string objectName)
    {
        var presignedGetObjectArgs = new PresignedGetObjectArgs()
            .WithBucket(HomeworkBucketName)
            .WithObject(objectName)
            .WithExpiry((int)TimeSpan.FromDays(1).TotalSeconds);
        var presignedUrl = await _minioClient.PresignedGetObjectAsync(presignedGetObjectArgs);
        
        return presignedUrl;
    }
}