import React, { useState } from 'react';
import axios from 'axios';

interface PhotoUploadProps {
    onSubmission: () => void;
    taskId: number;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({onSubmission, taskId}) => {
    const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setSelectedPhotos(fileArray);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedPhotos.length > 0) {
            const formData = new FormData();
            selectedPhotos.forEach((photo) => {
                formData.append('photos', photo);
            });

            axios
                .post(`http://localhost:5143/HomeworkPhotos/upload?taskId=${taskId}`, formData)
                .then((response) => {
                    console.log('Photos uploaded successfully');
                    onSubmission();
                })
                .catch((error) => {
                    console.error('Error uploading photos:', error);
                });
            setSelectedPhotos([]);
        }
    };

    return (
        <div className="photo-upload-container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="file-input" className="file-input-label">
                    <input
                        id="file-input"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        multiple
                        onChange={handlePhotoUpload}
                    />
                    <div className="upload-placeholder">Upload your solution</div>
                </label>
                <ul className="selected-files-list">
                    {selectedPhotos.map((photo, index) => (
                        <li key={index}>{photo.name}</li>
                    ))}
                </ul>
                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default PhotoUpload;